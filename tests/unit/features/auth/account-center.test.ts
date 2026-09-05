import { buildAccountCenterUrl } from "@features/auth";
import { describe, expect, it, vi } from "vitest";

// getLocale lives in the paraglide runtime; pin it so URLs are deterministic.
vi.mock("@generated/paraglide/runtime", () => ({
  getLocale: () => "ru",
}));

// Pin the config too, with values that are visibly NOT the developer's .env.
// Two reasons, both load-bearing:
//   1. These are runtime values now — read from the process environment when
//      shared/config is first imported, not inlined by Vite. A test that reads
//      `import.meta.env` is reading a different source than the code under test,
//      and it cannot even load where no .env exists (a container, a fresh clone).
//   2. An expectation computed from the same variable the code reads is green
//      whatever the code does. Literals below are the actual contract.
vi.mock("@shared/config", () => ({
  env: {
    VITE_OIDC_AUTHORITY: "https://auth.test/oidc",
    VITE_BASE_URL: "http://app.test",
  },
}));

describe("buildAccountCenterUrl", () => {
  it("targets the Logto endpoint origin derived from VITE_OIDC_AUTHORITY", () => {
    const url = new URL(buildAccountCenterUrl("password"));

    // Origin comes from VITE_OIDC_AUTHORITY — the /oidc path must be dropped,
    // the Account Center lives at the origin root.
    expect(url.origin).toBe("https://auth.test");
    expect(url.pathname).toBe("/account/password");
  });

  it("sets redirect, show_success and ui_locales by default", () => {
    const url = new URL(buildAccountCenterUrl("password"));

    expect(url.searchParams.get("redirect")).toBe("http://app.test/account");
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
        returnTo: "http://app.test/settings",
      }),
    );

    expect(url.searchParams.get("redirect")).toBe("http://app.test/settings");
  });

  it("omits show_success when disabled", () => {
    const url = new URL(
      buildAccountCenterUrl("password", { showSuccess: false }),
    );

    expect(url.searchParams.has("show_success")).toBe(false);
  });
});
