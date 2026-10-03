import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

/**
 * Automated accessibility pass: every route, in both themes, must have no
 * serious or critical axe violation (missing names, broken roles, contrast).
 * It catches the class of bug a screenshot cannot show — and contrast in the
 * dark theme, which is where a hand-picked colour usually breaks.
 */
const ROUTES = [
  { path: "/", name: "home" },
  { path: "/account", name: "account" },
  { path: "/non-existent-page", name: "404" },
];

for (const theme of ["light", "dark"] as const) {
  for (const route of ROUTES) {
    test(`${route.name} has no serious a11y violations (${theme})`, async ({
      page,
    }) => {
      // Entrance animations fade content in; axe would measure contrast
      // mid-fade. index.css cuts every animation under reduced motion.
      await page.emulateMedia({ reducedMotion: "reduce" });
      await page.addInitScript((t) => {
        // Mock auth (VITE_MOCK_AUTH build) so /account renders its content.
        localStorage.setItem("isTestAuthenticated", "true");
        localStorage.setItem(
          "litefront-theme",
          JSON.stringify({ state: { theme: t }, version: 1 }),
        );
      }, theme);
      await page.goto(route.path);
      await page.waitForLoadState("networkidle");
      await expect(page.locator("html")).toHaveAttribute("data-theme", theme);

      const { violations } = await new AxeBuilder({ page }).analyze();
      const blocking = violations
        .filter((v) => v.impact === "serious" || v.impact === "critical")
        .map((v) => ({
          rule: v.id,
          help: v.help,
          nodes: v.nodes.map(
            (n) => `${n.target.join(" ")}: ${n.failureSummary}`,
          ),
        }));
      expect(blocking).toEqual([]);
    });
  }
}
