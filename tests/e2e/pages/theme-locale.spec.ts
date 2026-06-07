import { expect, test } from "@playwright/test";

/**
 * Regression tests for the two switchers that were broken:
 *  - Theme: the toggle must flip daisyUI's `data-theme` AND survive a reload.
 *  - Locale: picking a language must persist (localStorage strategy) and win
 *    over the browser language on reload — previously the strategy was
 *    `["preferredLanguage"]` only, so the choice was lost on every reload.
 */

test.describe("Theme toggle", () => {
  test("flips data-theme and persists across reload", async ({ page }) => {
    await page.goto("/");
    const html = page.locator("html");

    // Default theme is the light "cmyk" theme.
    await expect(html).toHaveAttribute("data-theme", "cmyk");

    await page.getByRole("button", { name: /toggle theme/i }).click();
    await expect(html).toHaveAttribute("data-theme", "dark");

    // The choice must outlive a full reload (zustand persist + applyTheme).
    await page.reload();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  });
});

test.describe("Locale switcher", () => {
  test("switches language and persists across reload", async ({ page }) => {
    await page.goto("/");

    // Playwright's default browser language resolves to English first visit.
    const trigger = page.getByLabel(/language|язык/i);
    await expect(trigger).toContainText(/en/i);

    // Open the dropdown and pick Russian.
    await trigger.click();
    await page.getByRole("button", { name: "Русский" }).click();

    // setLocale persists then reloads; after reload the stored locale wins.
    await page.waitForLoadState("networkidle");

    const stored = await page.evaluate(() =>
      localStorage.getItem("PARAGLIDE_LOCALE"),
    );
    expect(stored).toBe("ru");

    await expect(page.getByLabel(/language|язык/i)).toContainText(/ru/i);
  });
});
