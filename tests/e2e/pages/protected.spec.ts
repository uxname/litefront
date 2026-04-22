import { expect, test } from "@playwright/test";

test.describe("Protected Page", () => {
  test("redirects unauthenticated users to home", async ({ page }) => {
    await page.goto("/protected");
    await expect(page).toHaveURL("/");
  });

  test("authenticated user can access the protected page", async ({ page }) => {
    // addInitScript runs before page scripts — localStorage is set before MockAuthProvider initialises
    await page.addInitScript(() => {
      localStorage.setItem("isTestAuthenticated", "true");
    });

    await page.goto("/protected");

    await expect(page).toHaveURL("/protected");
    await expect(
      page.getByRole("heading", { name: "Identity Dashboard" }),
    ).toBeVisible();
  });

  test("authenticated user is redirected after logout", async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem("isTestAuthenticated", "true");
    });

    await page.goto("/protected");
    await expect(
      page.getByRole("heading", { name: "Identity Dashboard" }),
    ).toBeVisible();

    await page.getByRole("button", { name: /end session/i }).click();

    await page.goto("/protected");
    await expect(page).toHaveURL("/");
  });
});
