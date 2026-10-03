import { expect, test } from "@playwright/test";

test.describe("404 Page", () => {
  test("displays custom 404 page for unknown routes", async ({ page }) => {
    await page.goto("/non-existent-page");
    await expect(
      page.getByRole("heading", { name: /page not found/i }),
    ).toBeVisible();
  });

  test("has link back to home", async ({ page }) => {
    await page.goto("/non-existent-page");
    const homeLink = page
      .getByRole("main")
      .getByRole("link", { name: /back to home/i });
    await expect(homeLink).toHaveAttribute("href", "/");
  });
});
