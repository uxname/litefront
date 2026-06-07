import { getLocale } from "@generated/paraglide/runtime";
import { env } from "@shared/config";

/**
 * Self-service actions exposed by the Logto hosted Account Center.
 * Each value maps to a `/account/<action>` page on the Logto endpoint.
 */
export type AccountAction =
  | "password"
  | "email"
  | "username"
  | "phone"
  | "authenticator-app"
  | "passkey/add";

interface AccountCenterUrlOptions {
  /** Absolute URL Logto redirects back to after the action completes. */
  returnTo?: string;
  /** Append `show_success` to the redirect URL on success (default: true). */
  showSuccess?: boolean;
}

/**
 * Build a URL to a Logto hosted Account Center page.
 *
 * Passwords (and other credentials) are managed entirely by the OIDC provider
 * (Logto) — never by this app or its backend. We navigate the user to Logto's
 * prebuilt, step-up-verified pages instead of building credential forms here.
 *
 * The Logto endpoint origin is derived from `VITE_OIDC_AUTHORITY`, so no extra
 * env var is required. Requires the Account Center to be enabled in the Logto
 * console (Sign-in & account → Account center) with the matching field set to
 * "Edit".
 */
export const buildAccountCenterUrl = (
  action: AccountAction,
  opts?: AccountCenterUrlOptions,
): string => {
  const origin = new URL(env.VITE_OIDC_AUTHORITY).origin;
  const url = new URL(`/account/${action}`, origin);

  url.searchParams.set(
    "redirect",
    opts?.returnTo ?? `${env.VITE_BASE_URL}/account`,
  );
  if (opts?.showSuccess ?? true) {
    url.searchParams.set("show_success", "true");
  }
  url.searchParams.set("ui_locales", getLocale());

  return url.toString();
};
