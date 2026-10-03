import { expect, test } from "@playwright/test";

/**
 * Regression tests for the two switchers that were broken:
 *  - Theme: picking one must set `data-theme` AND survive a reload; "system"
 *    (the default) must follow the OS colour scheme.
 *  - Locale: picking a language must persist (localStorage strategy) and win
 *    over the browser language on reload — previously the strategy was
 *    `["preferredLanguage"]` only, so the choice was lost on every reload.
 */

test.describe("Theme toggle", () => {
  test("follows the OS by default", async ({ page }) => {
    await page.emulateMedia({ colorScheme: "dark" });
    await page.goto("/");
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");

    await page.emulateMedia({ colorScheme: "light" });
    await page.reload();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  });

  test("sets the picked theme and persists it across reload", async ({
    page,
  }) => {
    await page.emulateMedia({ colorScheme: "light" });
    await page.goto("/");
    const html = page.locator("html");
    await expect(html).toHaveAttribute("data-theme", "light");

    await page.getByRole("button", { name: /^theme$/i }).click();
    await page.getByRole("menuitemradio", { name: /dark/i }).click();
    await expect(html).toHaveAttribute("data-theme", "dark");
    // Escape and outside clicks close the menu: it must not linger.
    await expect(page.getByRole("menu")).toBeHidden();

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
    await page.getByRole("menuitemradio", { name: /Русский/ }).click();

    // setLocale persists then reloads; after reload the stored locale wins.
    await page.waitForLoadState("networkidle");

    const stored = await page.evaluate(() =>
      localStorage.getItem("PARAGLIDE_LOCALE"),
    );
    expect(stored).toBe("ru");

    await expect(page.getByLabel(/language|язык/i)).toContainText(/ru/i);
  });
});
