#!/usr/bin/env node
// Opens every Ladle story in a headless browser and fails if any of them throws
// while rendering.
//
// `ladle build` is not this check: it only bundles. A story whose module throws
// on import — say a config module that expects values the workshop has no way to
// supply — builds perfectly green and is blank when you open it. That failure
// mode has already shipped once, and nothing in the repo could see it.
//
// Runs against the built output, so `npm run storybook:build` has to come first
// (verify:push does exactly that).
import { spawn } from "node:child_process";
import { chromium } from "playwright";

const PORT = 61234;
const BASE = `http://localhost:${PORT}`;
const BOOT_TIMEOUT_MS = 60_000;

// `ladle preview` serves storybook-build; --port keeps it off the dev port.
const server = spawn("npx", ["ladle", "preview", "--port", String(PORT)], {
  stdio: "ignore",
});
const stopServer = () => server.kill("SIGTERM");
process.on("exit", stopServer);

/** Polls meta.json until the preview server answers, then returns the story ids. */
const storyIds = async () => {
  const deadline = Date.now() + BOOT_TIMEOUT_MS;
  for (;;) {
    try {
      const meta = await (await fetch(`${BASE}/meta.json`)).json();
      return Object.keys(meta.stories);
    } catch (error) {
      if (Date.now() > deadline) {
        throw new Error(
          `ladle preview did not answer on ${BASE}: ${error.message}`,
        );
      }
      await new Promise((resolve) => setTimeout(resolve, 250));
    }
  }
};

const ids = await storyIds();
const browser = await chromium.launch();
const page = await browser.newPage();

const broken = [];
for (const id of ids) {
  const errors = [];
  const onPageError = (e) =>
    errors.push(`pageerror: ${e.message.split("\n")[0]}`);
  const onConsole = (m) => {
    if (m.type() === "error") {
      errors.push(`console: ${m.text().split("\n")[0]}`);
    }
  };
  page.on("pageerror", onPageError);
  page.on("console", onConsole);
  await page.goto(`${BASE}/?story=${id}&mode=preview`, {
    waitUntil: "networkidle",
  });
  // An empty canvas is a failure too: a story can render nothing without throwing.
  const rendered = await page.evaluate(
    () => (document.querySelector("#ladle-root")?.children.length ?? 0) > 0,
  );
  page.off("pageerror", onPageError);
  page.off("console", onConsole);
  if (errors.length > 0 || !rendered) {
    broken.push(`${id} — ${errors[0] ?? "rendered an empty canvas"}`);
  }
}

await browser.close();
stopServer();

if (broken.length > 0) {
  console.error(`✖ ${broken.length} of ${ids.length} stories do not render:\n`);
  for (const line of broken) {
    console.error(`  ${line}`);
  }
  console.error(
    "\nOpen it with 'npm run storybook:serve' and read the console.",
  );
  process.exit(1);
}
console.log(`✔ Story render check passed (${ids.length} stories).`);
