import { expect, type Page, test } from "@playwright/test";

const meProfile = {
  __typename: "Profile",
  id: 1,
  roles: ["USER"],
  avatarUrl: null,
  displayName: "Ada Test",
  bio: null,
  createdAt: "2024-01-01T00:00:00.000Z",
  updatedAt: "2024-01-01T00:00:00.000Z",
};

/** Stub the GraphQL endpoint so the page is hermetic (no live backend needed). */
const stubGraphQL = (page: Page) =>
  // `**/graphql**` (not `**/graphql`) so it also matches urql's GET queries,
  // which carry the operation in the query string (`/graphql?query=...`).
  page.route("**/graphql**", async (route) => {
    const request = route.request();
    const body = `${request.url()} ${request.postData() ?? ""}`;
    if (body.includes("UpdateProfile")) {
      return route.fulfill({
        json: {
          data: {
            updateProfile: {
              __typename: "Profile",
              id: 1,
              avatarUrl: null,
              displayName: "Ada Updated",
              bio: null,
              updatedAt: "2024-01-02T00:00:00.000Z",
            },
          },
        },
      });
    }
    return route.fulfill({ json: { data: { me: meProfile } } });
  });

const authenticate = (page: Page) =>
  page.addInitScript(() => {
    localStorage.setItem("isTestAuthenticated", "true");
  });

test.describe("Account/Profile Page", () => {
  test("redirects unauthenticated users to home", async ({ page }) => {
    await page.goto("/protected/account");
    await expect(page).toHaveURL("/");
  });

  test("renders the profile with backend data", async ({ page }) => {
    await authenticate(page);
    await stubGraphQL(page);

    await page.goto("/protected/account");

    await expect(page).toHaveURL("/protected/account");
    await expect(
      page.getByRole("heading", { name: "Profile", exact: true }),
    ).toBeVisible();
    await expect(page.getByText("Ada Test").first()).toBeVisible();
    await expect(page.getByText("User").first()).toBeVisible();
    await expect(
      page.getByRole("button", { name: /change password/i }),
    ).toBeVisible();
  });

  test("saves profile changes", async ({ page }) => {
    await authenticate(page);
    await stubGraphQL(page);

    await page.goto("/protected/account");

    const nameInput = page.getByLabel("Display name");
    await nameInput.fill("Ada Updated");
    await page.getByRole("button", { name: "Save changes" }).click();

    await expect(page.getByText("Profile saved")).toBeVisible();
  });
});
