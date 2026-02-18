import { expect, test } from "@playwright/test";

test.describe("Home Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("loads successfully", async ({ page }) => {
    await expect(page).toHaveTitle(/LiteFront/i);
  });

  test("displays hero section", async ({ page }) => {
    await expect(
      page.getByRole("heading", { name: /Build Modern Frontends/i }),
    ).toBeVisible();
  });

  test("counter increments on click", async ({ page }) => {
    const counterText = page.locator("text=0").first();
    await expect(counterText).toBeVisible();
    await page.getByRole("button", { name: /increment/i }).click();
    await expect(page.locator("text=1").first()).toBeVisible();
  });

  test("navigation link to protected page exists", async ({ page }) => {
    const link = page.getByRole("link", { name: /live demo/i });
    await expect(link).toBeVisible();
  });
});
