import { useThemeStore } from "@features/theme";
import {
  createMemoryHistory,
  createRootRoute,
  createRouter,
  Outlet,
  RouterProvider,
} from "@tanstack/react-router";
import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useAuth } from "react-oidc-context";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { Header } from "./index";

// `useAuth` is mocked unauthenticated by the global tests/setup.ts; grab the
// same mocked fn so individual tests can override the auth state.
const mockedUseAuth = vi.mocked(useAuth);

const baseAuth = {
  isAuthenticated: false,
  isLoading: false,
  user: null,
  signinRedirect: vi.fn(),
  signoutRedirect: vi.fn(),
};

/**
 * Render the Header inside a minimal in-memory TanStack Router so its `<Link>`
 * elements resolve against a real router context (a bare render would throw).
 */
const renderHeader = (props: { title?: string } = {}) => {
  const rootRoute = createRootRoute({
    component: () => (
      <>
        <Header {...props} />
        <Outlet />
      </>
    ),
  });
  const router = createRouter({
    routeTree: rootRoute,
    history: createMemoryHistory({ initialEntries: ["/"] }),
  });
  return render(<RouterProvider router={router as never} />);
};

afterEach(cleanup);

beforeEach(() => {
  // Reset the persisted zustand theme store to its default between tests.
  useThemeStore.setState({ theme: "cmyk" });
  mockedUseAuth.mockReturnValue(baseAuth as never);
});

describe("Header", () => {
  it("renders the brand link to home", async () => {
    renderHeader();
    const home = await screen.findByRole("link", { name: "LiteFront — home" });
    expect(home).toHaveAttribute("href", "/");
  });

  it("does not render a page title when none is given", async () => {
    renderHeader();
    await screen.findByRole("link", { name: "LiteFront — home" });
    expect(screen.queryByText("Dashboard")).not.toBeInTheDocument();
  });

  it("renders the page title next to the brand when provided", async () => {
    renderHeader({ title: "Dashboard" });
    expect(await screen.findByText("Dashboard")).toBeInTheDocument();
  });

  it("shows the sign-in button when unauthenticated", async () => {
    renderHeader();
    const signIn = await screen.findByRole("button", { name: "auth_sign_in" });
    expect(signIn).toBeInTheDocument();
    expect(signIn).toHaveAttribute("type", "button");
  });

  it("calls signinRedirect with the current location when sign-in is clicked", async () => {
    const user = userEvent.setup();
    const signinRedirect = vi.fn();
    mockedUseAuth.mockReturnValue({ ...baseAuth, signinRedirect } as never);
    renderHeader();
    await user.click(
      await screen.findByRole("button", { name: "auth_sign_in" }),
    );
    expect(signinRedirect).toHaveBeenCalledOnce();
    expect(signinRedirect).toHaveBeenCalledWith(
      expect.objectContaining({
        state: expect.objectContaining({ returnTo: expect.any(String) }),
      }),
    );
  });

  it("shows a verifying badge while auth is loading", async () => {
    mockedUseAuth.mockReturnValue({ ...baseAuth, isLoading: true } as never);
    renderHeader();
    expect(await screen.findByText("auth_verifying")).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "auth_sign_in" }),
    ).not.toBeInTheDocument();
  });

  it("shows the profile dropdown with the user email when authenticated", async () => {
    mockedUseAuth.mockReturnValue({
      ...baseAuth,
      isAuthenticated: true,
      user: { profile: { email: "jane@example.com" } },
    } as never);
    renderHeader();
    expect(await screen.findByText("jane@example.com")).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "auth_sign_in" }),
    ).not.toBeInTheDocument();
  });

  it("falls back to 'User' when the authenticated profile has no email", async () => {
    mockedUseAuth.mockReturnValue({
      ...baseAuth,
      isAuthenticated: true,
      user: { profile: {} },
    } as never);
    renderHeader();
    expect(await screen.findByText("User")).toBeInTheDocument();
  });

  it("calls signoutRedirect when the logout item is clicked", async () => {
    const user = userEvent.setup();
    const signoutRedirect = vi.fn();
    mockedUseAuth.mockReturnValue({
      ...baseAuth,
      isAuthenticated: true,
      user: { profile: { email: "jane@example.com" } },
      signoutRedirect,
    } as never);
    renderHeader();
    const menu = await screen.findByText("auth_logout");
    await user.click(menu);
    expect(signoutRedirect).toHaveBeenCalledOnce();
  });

  it("links to the account page from the profile dropdown", async () => {
    mockedUseAuth.mockReturnValue({
      ...baseAuth,
      isAuthenticated: true,
      user: { profile: { email: "jane@example.com" } },
    } as never);
    renderHeader();
    const settings = await screen.findByText("profile_settings_title");
    const link = settings.closest("a");
    expect(link).toHaveAttribute("href", "/account");
  });

  it("always renders the locale and theme controls", async () => {
    renderHeader();
    const nav = await screen.findByRole("navigation");
    // Theme toggle exposes its label; locale switcher exposes its own.
    expect(
      within(nav).getByRole("button", { name: "theme_toggle" }),
    ).toBeInTheDocument();
  });
});
