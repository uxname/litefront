import { afterEach, expect, it, vi } from "vitest";

// Spelled out instead of imported from the module under test: a test that reads
// the name from the implementation cannot notice the name changing, and the
// name is a contract with the inline <script> in routes/__root.tsx.
const RUNTIME_CONFIG_GLOBAL = "__LITEFRONT_RUNTIME_CONFIG__";

const validConfig = {
  VITE_OIDC_AUTHORITY: "https://auth.test/oidc",
  VITE_OIDC_CLIENT_ID: "test-client",
  VITE_OIDC_REDIRECT_URI: "http://localhost:3000/callback",
  VITE_OIDC_SCOPE: "openid profile",
  VITE_GRAPHQL_API_URL: "http://api.test/graphql",
  VITE_OIDC_API_RESOURCE: "http://api.test",
  VITE_BASE_URL: "http://localhost:3000",
  VITE_SENTRY_DSN: "",
  VITE_APP_VERSION: "1.2.3",
};

// The module validates while it is being imported, so every case needs a fresh
// module registry. Without `injected` the module falls through to the process
// environment — the path the SSR server takes at boot.
const loadConfig = (injected?: Record<string, unknown>) => {
  vi.resetModules();
  if (injected) {
    vi.stubGlobal(RUNTIME_CONFIG_GLOBAL, injected);
  }
  return import("./env");
};

const payloadOf = (script: string): Record<string, string> =>
  JSON.parse(
    script.replace(`window.${RUNTIME_CONFIG_GLOBAL}=`, "").slice(0, -1),
  );

afterEach(() => {
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
});

it("C2: reads runtime values from the injected config, not from the bundle", async () => {
  const { env } = await loadConfig({
    ...validConfig,
    VITE_GRAPHQL_API_URL: "https://injected.test/graphql",
  });

  // `.env` — and therefore both `process.env` and the `import.meta.env` Vite
  // used to inline — holds a different URL, so a build-time value wins here.
  expect(env.VITE_GRAPHQL_API_URL).toBe("https://injected.test/graphql");
});

it("C2: the browser rebuilds the same payload the server published", async () => {
  const server = await loadConfig(validConfig);
  const client = await loadConfig(payloadOf(server.runtimeConfigScript));

  // Byte-identical, or React reports a hydration mismatch on the <script>.
  expect(client.runtimeConfigScript).toBe(server.runtimeConfigScript);
});

it("C3: publishes only the listed keys, so a neighbour cannot ride along", async () => {
  const { runtimeConfigScript } = await loadConfig({
    ...validConfig,
    OIDC_CLIENT_SECRET: "must-not-ship",
  });

  expect(Object.keys(payloadOf(runtimeConfigScript))).toEqual(
    Object.keys(validConfig),
  );
  expect(runtimeConfigScript).not.toContain("must-not-ship");
});

it("C3: escapes `<` so a value cannot close the injected script tag", async () => {
  const { runtimeConfigScript } = await loadConfig({
    ...validConfig,
    VITE_APP_VERSION: "</script><script>alert(1)</script>",
  });

  expect(runtimeConfigScript).not.toContain("</script>");
});

it("C4: refuses to load and names the variable when a required one is unset", async () => {
  const { VITE_GRAPHQL_API_URL: _unset, ...withoutApiUrl } = validConfig;

  await expect(loadConfig(withoutApiUrl)).rejects.toThrow(
    /VITE_GRAPHQL_API_URL is required/,
  );
});

it("C4: refuses to load when the server's own environment is incomplete", async () => {
  // No injected global: this is the path `src/server.ts` takes at boot.
  vi.stubEnv("VITE_OIDC_CLIENT_ID", "");

  await expect(loadConfig()).rejects.toThrow(/VITE_OIDC_CLIENT_ID is required/);
});

it("C4: refuses to load when a required value is nothing but whitespace", async () => {
  // A single space used to pass `min(1)`: the server booted green and died
  // later inside `new URL`, far from the variable that was actually wrong.
  await expect(
    loadConfig({ ...validConfig, VITE_GRAPHQL_API_URL: " " }),
  ).rejects.toThrow(/VITE_GRAPHQL_API_URL is required/);
});

it("C1: PROD and DEV arriving as strings do not stop the boot", async () => {
  // The Nitro server chunk compiles `import.meta.env` down to `process.env`, so
  // a container variable named PROD or DEV reaches this schema as a string. It
  // must not be able to keep the server from starting. The schema is fed
  // directly because Vitest's `import.meta.env` is a Proxy that coerces these
  // two to booleans, so the module can never see a string under test.
  const { buildTimeSchema } = await loadConfig(validConfig);

  const parsed = buildTimeSchema.safeParse({
    VITE_MOCK_AUTH: "",
    MODE: "production",
    PROD: "true",
    DEV: "false",
  });

  expect(parsed.error).toBeUndefined();
  expect(parsed.data).toMatchObject({ PROD: true, DEV: false });
});

it("C1: a build-time flag that is neither `true` nor a string is false", async () => {
  const { buildTimeSchema } = await loadConfig(validConfig);

  // `{}` is the unset case (nothing named PROD/DEV in the environment), `1` is
  // the shape a `PROD=1` container variable takes after any coercion layer.
  expect(buildTimeSchema.safeParse({}).data).toMatchObject({
    PROD: false,
    DEV: false,
  });
  expect(buildTimeSchema.safeParse({ PROD: 1, DEV: "yes" }).data).toMatchObject(
    {
      PROD: false,
      DEV: false,
    },
  );
});
