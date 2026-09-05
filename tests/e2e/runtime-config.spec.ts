import { type ChildProcess, spawn } from "node:child_process";
import { setTimeout as sleep } from "node:timers/promises";
import { fileURLToPath } from "node:url";
import { expect, type Page, test } from "@playwright/test";

/* The built Nitro server, started exactly the way the Docker image starts it
   (`npm run start:prod` = `node .output/server/index.mjs`). playwright.config.ts
   builds it once before any test runs and this file never rebuilds: every server
   booted below is THE SAME bundle, which is the whole point of the file. */
const SERVER_ENTRY = fileURLToPath(
  new URL("../../.output/server/index.mjs", import.meta.url),
);

/* Nitro's node-server preset prints this line once — and only once — it has
   bound the port. Its absence is how the failure case below shows that a
   misconfigured container never took the port. */
const LISTENING = "Listening on";

const BOOT_TIMEOUT_MS = 30_000;

/* Ports are derived from the worker index (this file runs once per browser
   project, in parallel) so two workers never fight over a port, and they start
   above the port playwright.config.ts runs the suite's own server on (3100). */
const portFor = (offset: number) =>
  3120 + test.info().parallelIndex * 10 + offset;

/* A complete, valid container environment, tagged so two of them can never be
   confused. Written out here as plain strings on purpose: reading the expected
   values from the app's own config module would make every assertion below pass
   even with the mechanism ripped out. */
const environmentOf = (tag: string, port: number) => ({
  VITE_OIDC_AUTHORITY: `https://auth.${tag}.example`,
  VITE_OIDC_CLIENT_ID: `${tag}-client`,
  VITE_OIDC_REDIRECT_URI: `http://localhost:${port}/callback`,
  VITE_OIDC_SCOPE: "openid profile",
  VITE_GRAPHQL_API_URL: `https://${tag}.example/graphql`,
  VITE_BASE_URL: `http://localhost:${port}`,
  VITE_APP_VERSION: `1.0.0-${tag}`,
});

type BootedServer = {
  /** Everything the process wrote to stdout and stderr, up to boot or death. */
  output: string;
  /** Did it announce that it took the port? */
  listening: boolean;
  /** Exit code, or null while the process is still alive. */
  exitCode: number | null;
};

const running: ChildProcess[] = [];

/** Boots the built server and waits until it either binds the port or dies. */
const boot = async (
  port: number,
  environment: Record<string, string>,
): Promise<BootedServer> => {
  const child = spawn(process.execPath, [SERVER_ENTRY], {
    /* Assembled explicitly instead of spreading process.env: playwright.config.ts
       loads `.env` into this process, so inheriting it would hand the child the
       very variable the failure case removes. */
    env: { PATH: process.env.PATH, PORT: String(port), ...environment },
    stdio: ["ignore", "pipe", "pipe"],
  });
  running.push(child);

  let output = "";
  const collect = (chunk: Buffer) => {
    output += String(chunk);
  };
  child.stdout.on("data", collect);
  child.stderr.on("data", collect);

  let exitCode: number | null = null;
  let dead = false;
  /* "close", not "exit": it fires after the pipes have drained, so a crash
     message can't be missed by finishing the wait too early. */
  child.on("close", (code) => {
    dead = true;
    exitCode = code;
  });

  const deadline = Date.now() + BOOT_TIMEOUT_MS;
  while (!dead && !output.includes(LISTENING) && Date.now() < deadline) {
    await sleep(50);
  }
  return { output, listening: output.includes(LISTENING), exitCode };
};

/** What the browser actually got: the global the SSR <head> script defines. */
const runtimeConfigOf = (page: Page) =>
  page.evaluate(
    () =>
      (window as unknown as Record<string, Record<string, string>>)
        .__LITEFRONT_RUNTIME_CONFIG__,
  );

test.afterEach(() => {
  for (const child of running.splice(0)) {
    child.kill();
  }
});

/* C1: one image, two environments, no rebuild between them. Both servers run
   the same file on disk; only their environment differs. If any of these values
   were still baked in at build time, the two pages would report the same one. */
test("C1: one built bundle serves two environments without a rebuild", async ({
  page,
}) => {
  const alphaPort = portFor(0);
  const bravoPort = portFor(1);

  const alpha = await boot(alphaPort, environmentOf("alpha", alphaPort));
  expect(alpha.listening, alpha.output).toBe(true);
  const bravo = await boot(bravoPort, environmentOf("bravo", bravoPort));
  expect(bravo.listening, bravo.output).toBe(true);

  await page.goto(`http://localhost:${alphaPort}/`);
  expect(await runtimeConfigOf(page)).toMatchObject({
    VITE_GRAPHQL_API_URL: "https://alpha.example/graphql",
    VITE_OIDC_CLIENT_ID: "alpha-client",
    VITE_APP_VERSION: "1.0.0-alpha",
  });

  await page.goto(`http://localhost:${bravoPort}/`);
  expect(await runtimeConfigOf(page)).toMatchObject({
    VITE_GRAPHQL_API_URL: "https://bravo.example/graphql",
    VITE_OIDC_CLIENT_ID: "bravo-client",
    VITE_APP_VERSION: "1.0.0-bravo",
  });
});

/* C4: the container must die at startup, not serve pages against a half-set
   environment. This one is worth its runtime: the check lives in a Nitro startup
   plugin, Nitro bundles with `moduleSideEffects: false`, and an earlier version
   of it was silently tree-shaken away — leaving a server that booted green. */
test("C4: the server refuses to boot without a required variable and names it", async () => {
  const port = portFor(2);
  const { VITE_GRAPHQL_API_URL, ...withoutApiUrl } = environmentOf("gap", port);
  expect(VITE_GRAPHQL_API_URL).toBeTruthy(); // the removed one really was set

  const server = await boot(port, withoutApiUrl);

  expect(server.exitCode, server.output).not.toBe(0);
  expect(server.exitCode, server.output).not.toBeNull(); // it died, not hung
  expect(server.output).toContain("VITE_GRAPHQL_API_URL");
  expect(server.listening, server.output).toBe(false); // the port was never taken
});
