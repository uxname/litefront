import { expect, test } from "@playwright/test";

test.describe("Protected Page", () => {
  test("redirects unauthenticated users to home", async ({ page }) => {
    await page.goto("/protected");
    await expect(page).toHaveURL("/");
  });
});
