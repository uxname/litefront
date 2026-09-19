#!/usr/bin/env node
// Opens every Storybook story in a headless browser and fails if any of them
// throws while rendering.
//
// `storybook build` is not this check: it only bundles. A story whose module
// throws on import — say a config module that expects values the workshop has no
// way to supply — builds perfectly green and is blank when you open it. That
// failure mode has already shipped once, and nothing in the repo could see it.
//
// Runs against the built output, so `npm run storybook:build` has to come first
// (verify:push does exactly that). No server is started: the browser's requests
// are answered straight from the build directory.
import { existsSync, readFileSync, statSync } from "node:fs";
import { join, normalize, resolve } from "node:path";
import { chromium } from "@playwright/test";

const BUILD_DIR = resolve("storybook-build");
// Never listened on — every request to this origin is fulfilled from disk below.
const BASE = "http://localhost:61234";

if (!existsSync(join(BUILD_DIR, "index.json"))) {
  console.error(
    `✖ ${BUILD_DIR}/index.json not found — run 'npm run storybook:build' first.`,
  );
  process.exit(1);
}

// index.json is Storybook's own list of what it built; docs entries have no canvas.
const { entries } = JSON.parse(
  readFileSync(join(BUILD_DIR, "index.json"), "utf8"),
);
const ids = Object.values(entries)
  .filter((entry) => entry.type === "story")
  .map((entry) => entry.id);

// A build that found no stories renders nothing and would otherwise pass: a
// broken `stories` glob must not look like a clean run.
if (ids.length === 0) {
  console.error("✖ The Storybook build contains no stories.");
  process.exit(1);
}

const browser = await chromium.launch();
const page = await browser.newPage();

await page.route(`${BASE}/**`, (route) => {
  const { pathname } = new URL(route.request().url());
  const file = normalize(join(BUILD_DIR, decodeURIComponent(pathname)));
  // Stay inside the build directory, and answer only for real files.
  if (
    !file.startsWith(BUILD_DIR) ||
    !existsSync(file) ||
    !statSync(file).isFile()
  ) {
    return route.fulfill({ status: 404, body: "not found" });
  }
  return route.fulfill({ path: file });
});

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
  await page.goto(`${BASE}/iframe.html?id=${id}&viewMode=story`, {
    waitUntil: "networkidle",
  });
  // An empty canvas is a failure too: a story can render nothing without
  // throwing. So is Storybook's own error screen, which it shows INSTEAD of
  // throwing when a story fails — the body class is how it says so.
  const rendered = await page.evaluate(
    () =>
      (document.querySelector("#storybook-root")?.children.length ?? 0) > 0 &&
      !document.body.classList.contains("sb-show-errordisplay"),
  );
  page.off("pageerror", onPageError);
  page.off("console", onConsole);
  if (errors.length > 0 || !rendered) {
    broken.push(`${id} — ${errors[0] ?? "rendered an empty canvas"}`);
  }
}

await browser.close();

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
