import type { UserManagerSettings } from "oidc-client-ts";
import { describe, expect, it } from "vitest";
import { getOidcConfig } from "./oidc-client";

describe("getOidcConfig", () => {
  // Sign-out used to drop the tokens locally only; the refresh token
  // (offline_access) stayed valid at the IdP.
  it("revokes the tokens at the IdP on sign-out", () => {
    const settings = getOidcConfig() as UserManagerSettings;
    expect(settings.revokeTokensOnSignout).toBe(true);
  });
});
