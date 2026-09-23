import type { UserManagerSettings } from "oidc-client-ts";
import { describe, expect, it } from "vitest";
import { getOidcConfig } from "./oidc-client";

describe("getOidcConfig", () => {
  // Revocation runs from signOut() (lib/sign-out.ts), best effort. The
  // library's own revokeTokensOnSignout aborted the whole sign-out — tokens
  // left in localStorage — whenever the revocation request failed.
  it("leaves revocation to signOut instead of the library's all-or-nothing flag", () => {
    const settings = getOidcConfig() as UserManagerSettings;
    expect(settings.revokeTokensOnSignout).toBeFalsy();
  });
});
