import { expect, test } from "@playwright/test";

test.describe("Account Page", () => {
  test("redirects unauthenticated users to home", async ({ page }) => {
    await page.goto("/protected/account");
    await expect(page).toHaveURL("/");
  });

  test("authenticated user can access account settings", async ({ page }) => {
    // addInitScript runs before page scripts — localStorage is set before MockAuthProvider initialises
    await page.addInitScript(() => {
      localStorage.setItem("isTestAuthenticated", "true");
    });

    await page.goto("/protected/account");

    await expect(page).toHaveURL("/protected/account");
    await expect(
      page.getByRole("heading", { name: "Account settings" }),
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: /change password/i }).first(),
    ).toBeVisible();
  });
});
