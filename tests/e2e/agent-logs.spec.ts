/// <reference types="node" />
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { expect, type Page, test } from "@playwright/test";

/**
 * Agent log harness — makes the frontend observable to AI agents.
 *
 * Most AI agents cannot see a browser console. This spec drives the app
 * headlessly, captures everything the browser would normally only show in
 * DevTools — `console.*`, uncaught errors, unhandled promise rejections and
 * failed network requests — and writes it to `test-results/frontend-logs.json`
 * (+ a human-readable `.log`) and to stdout. An agent then just reads those
 * files / the test output instead of needing eyes on a screen.
 *
 * Run it with:  npm run test:e2e:logs
 * Read after:   test-results/frontend-logs.log  (or .json for structured data)
 *
 * It is a COLLECTOR, not a gate: it visits the key routes, exercises the
 * theme + locale switchers, and records what happens. It only fails if the
 * page throws an uncaught error or a same-origin request fails — those are
 * real frontend breakages an agent must know about. Plain console noise is
 * recorded but never fails the run, so the full log always reaches the agent.
 */

type LogEntry = {
  kind: "console" | "pageerror" | "requestfailed" | "response" | "nav";
  level: string;
  text: string;
  url?: string;
  location?: string;
};

const OUT_JSON = resolve("test-results/frontend-logs.json");
const OUT_LOG = resolve("test-results/frontend-logs.log");

/**
 * react-scan (dev perf profiler) logs a console group for every component
 * render when running against a dev server — pure noise that buries real
 * messages. Drop it so the log stays signal.
 */
const isNoise = (level: string, location?: string): boolean =>
  level === "startGroup" ||
  level === "endGroup" ||
  (location?.includes("react-scan") ?? false);

/** Attach listeners that mirror the browser console/network into `entries`. */
const capture = (page: Page, entries: LogEntry[]) => {
  page.on("console", (msg) => {
    const loc = msg.location();
    const location = loc.url
      ? `${loc.url}:${loc.lineNumber}:${loc.columnNumber}`
      : undefined;
    if (isNoise(msg.type(), location)) return;
    entries.push({
      kind: "console",
      level: msg.type(),
      text: msg.text(),
      location,
    });
  });

  page.on("pageerror", (err) => {
    entries.push({
      kind: "pageerror",
      level: "error",
      text: `${err.name}: ${err.message}\n${err.stack ?? ""}`.trim(),
    });
  });

  page.on("requestfailed", (req) => {
    entries.push({
      kind: "requestfailed",
      level: "error",
      text: req.failure()?.errorText ?? "request failed",
      url: req.url(),
    });
  });

  page.on("response", (res) => {
    if (res.status() >= 400) {
      entries.push({
        kind: "response",
        level: res.status() >= 500 ? "error" : "warn",
        text: `HTTP ${res.status()} ${res.statusText()}`,
        url: res.url(),
      });
    }
  });
};

const fmt = (e: LogEntry): string =>
  `[${e.kind}/${e.level}] ${e.text}${e.url ? ` <${e.url}>` : ""}${e.location ? ` (${e.location})` : ""}`;

test("agent log harness: capture frontend console + errors + network", async ({
  page,
  baseURL,
}) => {
  const entries: LogEntry[] = [];
  capture(page, entries);

  // Authenticate against the mock auth provider so protected routes render
  // (mirrors tests/e2e/pages/account.spec.ts).
  await page.addInitScript(() => {
    localStorage.setItem("isTestAuthenticated", "true");
  });

  const visit = async (path: string, label: string) => {
    entries.push({ kind: "nav", level: "info", text: `→ ${label} (${path})` });
    await page.goto(path);
    await page.waitForLoadState("networkidle").catch(() => {});
  };

  // Walk the key routes.
  await visit("/", "home");
  await visit("/protected", "protected");
  await visit("/non-existent-page", "404");

  // Exercise the theme + locale switchers (the two things that were broken),
  // so any runtime error they throw lands in the log.
  await visit("/", "home (interaction)");
  await page
    .getByRole("button", { name: /toggle theme|переключить тему/i })
    .click()
    .catch(() => {});
  await page.waitForTimeout(200);
  // Open the locale dropdown, then pick the first language entry.
  await page
    .getByLabel(/language|язык/i)
    .click()
    .catch(() => {});
  await page.waitForTimeout(200);
  await page
    .getByRole("button", { name: /русский|english/i })
    .first()
    .click()
    .catch(() => {});
  await page.waitForTimeout(500);

  // Persist for the agent to read.
  const header =
    `Frontend log capture — base ${baseURL}\n` +
    `${entries.length} entries\n${"=".repeat(60)}\n`;
  const body = entries.map(fmt).join("\n");
  mkdirSync(dirname(OUT_LOG), { recursive: true });
  writeFileSync(OUT_LOG, `${header}${body}\n`);
  writeFileSync(OUT_JSON, JSON.stringify(entries, null, 2));

  // Echo to stdout so it shows up directly in test output too.
  console.log(`\n${header}${body}\n`);
  console.log(`Logs written to:\n  ${OUT_LOG}\n  ${OUT_JSON}`);

  // Fail only on genuine frontend breakage, not on console noise.
  const breakages = entries.filter(
    (e) =>
      e.kind === "pageerror" ||
      (e.kind === "requestfailed" &&
        e.url?.startsWith(baseURL ?? "http://localhost:3000")) ||
      (e.kind === "response" &&
        e.level === "error" &&
        e.url?.startsWith(baseURL ?? "http://localhost:3000")),
  );
  expect(
    breakages,
    `frontend breakages:\n${breakages.map(fmt).join("\n")}`,
  ).toEqual([]);
});
