import { buildAccountCenterUrl } from "@features/auth";
import { describe, expect, it, vi } from "vitest";

// getLocale lives in the paraglide runtime; pin it so URLs are deterministic.
vi.mock("@generated/paraglide/runtime", () => ({
  getLocale: () => "ru",
}));

describe("buildAccountCenterUrl", () => {
  it("targets the Logto endpoint origin derived from VITE_OIDC_AUTHORITY", () => {
    const url = new URL(buildAccountCenterUrl("password"));

    // Origin comes from VITE_OIDC_AUTHORITY — the /oidc path must be dropped,
    // the Account Center lives at the origin root.
    const expectedOrigin = new URL(import.meta.env.VITE_OIDC_AUTHORITY).origin;
    expect(url.origin).toBe(expectedOrigin);
    expect(url.pathname).toBe("/account/password");
  });

  it("sets redirect, show_success and ui_locales by default", () => {
    const url = new URL(buildAccountCenterUrl("password"));

    expect(url.searchParams.get("redirect")).toBe(
      "http://localhost:3000/account",
    );
    expect(url.searchParams.get("show_success")).toBe("true");
    expect(url.searchParams.get("ui_locales")).toBe("ru");
  });

  it("preserves multi-segment action paths", () => {
    const url = new URL(buildAccountCenterUrl("passkey/add"));

    expect(url.pathname).toBe("/account/passkey/add");
  });

  it("honors a custom returnTo", () => {
    const url = new URL(
      buildAccountCenterUrl("email", {
        returnTo: "http://localhost:3000/settings",
      }),
    );

    expect(url.searchParams.get("redirect")).toBe(
      "http://localhost:3000/settings",
    );
  });

  it("omits show_success when disabled", () => {
    const url = new URL(
      buildAccountCenterUrl("password", { showSuccess: false }),
    );

    expect(url.searchParams.has("show_success")).toBe(false);
  });
});
