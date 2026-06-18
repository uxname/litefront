/// <reference types="node" />
import { mkdirSync } from "node:fs";
import { resolve } from "node:path";
import {
  type Browser,
  type BrowserContext,
  expect,
  type Page,
  test,
} from "@playwright/test";

/**
 * Agent screenshot harness — gives an AI agent EYES on the rendered UI.
 *
 * The log harness (agent-logs.spec.ts) makes the frontend observable as text
 * (console/errors/network). This one makes it observable as pixels: it drives
 * the app headlessly and writes a full-page PNG for every key route, in BOTH
 * daisyUI themes and at desktop + mobile widths, to `test-results/screenshots/`.
 * An agent then READS those PNGs (the Read tool renders images) instead of
 * needing eyes on a live browser.
 *
 * Run it with:  npm run test:e2e:screens
 * Read after:   test-results/screenshots/<route>-<theme>-<viewport>.png
 *
 * Why both themes: the dark theme regressed once because components used
 * hardcoded Tailwind palette colors instead of daisyUI SEMANTIC tokens, so they
 * stayed light under `data-theme="dark"`. Comparing `*-cmyk-*` vs `*-dark-*`
 * makes that class of bug visible at a glance.
 *
 * Like the log harness it is a COLLECTOR, not a strict gate: it captures the
 * matrix and only fails if a page throws an uncaught error or a same-origin
 * request fails — a broken render an agent must know about. The screenshots are
 * always written first, so the agent can look even when the spec fails.
 */

const OUT_DIR = resolve("test-results/screenshots");

type Theme = "cmyk" | "dark";
type Viewport = { name: string; width: number; height: number };

const ROUTES: { path: string; label: string }[] = [
  { path: "/", label: "home" },
  { path: "/account", label: "account" },
  { path: "/non-existent-page", label: "404" },
];

const THEMES: Theme[] = ["cmyk", "dark"];

const VIEWPORTS: Viewport[] = [
  { name: "desktop", width: 1280, height: 800 },
  { name: "mobile", width: 390, height: 844 },
];

type Breakage = { kind: string; text: string; url?: string };

/** Records page errors and same-origin request/HTTP failures across the run. */
const watchForBreakage = (page: Page, baseURL: string, sink: Breakage[]) => {
  const sameOrigin = (url: string) => url.startsWith(baseURL);
  page.on("pageerror", (err) => {
    sink.push({ kind: "pageerror", text: `${err.name}: ${err.message}` });
  });
  page.on("requestfailed", (req) => {
    if (sameOrigin(req.url())) {
      sink.push({
        kind: "requestfailed",
        text: req.failure()?.errorText ?? "request failed",
        url: req.url(),
      });
    }
  });
  page.on("response", (res) => {
    if (res.status() >= 500 && sameOrigin(res.url())) {
      sink.push({
        kind: "response",
        text: `HTTP ${res.status()} ${res.statusText()}`,
        url: res.url(),
      });
    }
  });
};

/**
 * A fresh context pinned to one theme + viewport. The theme is injected two
 * ways for determinism regardless of rehydrate timing: the zustand persist key
 * (`litefront-theme`) so `onRehydrateStorage` applies it on boot, and a direct
 * `data-theme` after load as a belt-and-suspenders. Mock auth mirrors
 * agent-logs.spec.ts so protected routes (/account) render.
 */
const openContext = async (
  browser: Browser,
  theme: Theme,
  viewport: Viewport,
): Promise<BrowserContext> => {
  const context = await browser.newContext({
    viewport: { width: viewport.width, height: viewport.height },
  });
  await context.addInitScript(
    ([t]) => {
      localStorage.setItem("isTestAuthenticated", "true");
      localStorage.setItem(
        "litefront-theme",
        JSON.stringify({ state: { theme: t }, version: 0 }),
      );
    },
    [theme],
  );
  return context;
};

test("agent screenshot harness: capture routes × themes × viewports", async ({
  browser,
  baseURL,
}) => {
  mkdirSync(OUT_DIR, { recursive: true });
  const origin = baseURL ?? "http://localhost:3000";
  const breakages: Breakage[] = [];
  const written: string[] = [];

  for (const theme of THEMES) {
    for (const viewport of VIEWPORTS) {
      const context = await openContext(browser, theme, viewport);
      const page = await context.newPage();
      watchForBreakage(page, origin, breakages);

      for (const route of ROUTES) {
        await page.goto(route.path);
        await page.waitForLoadState("networkidle").catch(() => {});
        // Belt-and-suspenders: ensure the theme attribute is set before the shot.
        await page
          .evaluate((t) => {
            document.documentElement.dataset.theme = t;
          }, theme)
          .catch(() => {});
        await page.waitForTimeout(150);

        const file = `${route.label}-${theme}-${viewport.name}.png`;
        await page.screenshot({ path: resolve(OUT_DIR, file), fullPage: true });
        written.push(file);
      }

      await context.close();
    }
  }

  console.log(
    `\nScreenshots written to ${OUT_DIR} (${written.length}):\n  ${written.join("\n  ")}\n`,
  );

  // Fail only on genuine frontend breakage; the screenshots are already saved.
  const fmt = (b: Breakage) =>
    `[${b.kind}] ${b.text}${b.url ? ` <${b.url}>` : ""}`;
  expect(
    breakages,
    `frontend breakages while capturing screenshots:\n${breakages.map(fmt).join("\n")}`,
  ).toEqual([]);
});
