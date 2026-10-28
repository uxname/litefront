import type { AccountAction } from "@features/auth";
import type { MeQuery, ProfileRole } from "@generated/graphql";
import { m } from "@generated/paraglide/messages";
import { getLocale } from "@generated/paraglide/runtime";
import {
  KeyRound,
  Lock,
  type LucideIcon,
  Mail,
  Smartphone,
} from "lucide-react";

/** A single row in the Logto-managed "Account & security" list. */
export interface SecurityAction {
  action: AccountAction;
  title: string;
  icon: LucideIcon;
}

/**
 * Build the ordered list of self-service security actions shown on the account
 * page. Titles are resolved through paraglide so they follow the active locale.
 */
export const buildSecurityActions = (): SecurityAction[] => [
  { action: "email", title: m.change_email(), icon: Mail },
  { action: "password", title: m.change_password(), icon: Lock },
  { action: "authenticator-app", title: m.manage_mfa(), icon: Smartphone },
  { action: "passkey/add", title: m.manage_passkey(), icon: KeyRound },
];

// docc:begin account#^ACC-3@vvhc ~k8fx
/** The message for each action, by the name Logto or our return address gives it. */
const CHANGE_MESSAGES: Record<string, () => string> = {
  email: m.account_changed_email,
  password: m.account_changed_password,
  "authenticator-app": m.account_changed_mfa,
  passkey: m.account_changed_passkey,
  "passkey/add": m.account_changed_passkey,
};

/**
 * What to tell a person back from the Logto Account Center, or null when nothing
 * changed. Logto marks a success with `show_success`, whose value names the action
 * ("email", "password") or is just "true" — "false" is no success; `changed` is the action our own return
 * address carries. An action neither names gets the general message.
 */
export const accountChangeMessage = (
  showSuccess?: string,
  changed?: string,
): string | null => {
  if (!showSuccess || showSuccess === "false") return null;
  return (lookup(showSuccess) ?? lookup(changed) ?? m.account_changed)();
};

/** Own keys only: the values come from the URL, and "__proto__" or "toString" must not resolve. */
const lookup = (action?: string): (() => string) | undefined =>
  action && Object.hasOwn(CHANGE_MESSAGES, action)
    ? CHANGE_MESSAGES[action]
    : undefined;
// docc:end

/** The backend `me` record, when loaded. */
type Me = MeQuery["me"];

/**
 * Subset of OIDC ID-token claims this page reads. Each field is `unknown`
 * because the provider gives no static guarantee of its presence or type, so
 * every read is runtime-narrowed before use.
 */
export interface ProfileClaims {
  picture?: unknown;
  name?: unknown;
  email?: unknown;
  email_verified?: unknown;
}

/**
 * Avatar URL fallback chain: backend `avatarUrl`, then the OIDC `picture`
 * claim (only when it is a string), otherwise `null`.
 */
export const resolveAvatarUrl = (
  me: Pick<Me, "avatarUrl"> | null | undefined,
  claims: ProfileClaims | null | undefined,
): string | null =>
  me?.avatarUrl ??
  (typeof claims?.picture === "string" ? claims.picture : null);

/**
 * Display-name fallback chain: backend `displayName`, then the OIDC `name`
 * claim, then the OIDC `email` claim, otherwise `undefined`.
 */
export const resolveDisplayName = (
  me: Pick<Me, "displayName"> | null | undefined,
  claims: ProfileClaims | null | undefined,
): string | undefined =>
  me?.displayName ??
  (typeof claims?.name === "string" ? claims.name : undefined) ??
  (typeof claims?.email === "string" ? claims.email : undefined);

/** The OIDC `email` claim, only when it is a string. */
export const resolveEmail = (
  claims: ProfileClaims | null | undefined,
): string | undefined =>
  typeof claims?.email === "string" ? claims.email : undefined;

/** The OIDC `email_verified` claim, only when it is a boolean. */
export const resolveEmailVerified = (
  claims: ProfileClaims | null | undefined,
): boolean | undefined =>
  typeof claims?.email_verified === "boolean"
    ? claims.email_verified
    : undefined;

/**
 * Format the backend `createdAt` timestamp as a `YYYY-MM-DD` string, or
 * `undefined` when there is no value to format.
 *
 * `toISOString` is always UTC and always this shape, so the server and the
 * client render the same text whatever their locale and timezone are — a
 * locale-aware formatter would mismatch on hydration.
 */
export const formatMemberSince = (
  createdAt: Me["createdAt"] | null | undefined,
): string | undefined => {
  if (!createdAt) return undefined;
  const date = new Date(String(createdAt));
  // Guard against an unparseable timestamp (toISOString would throw on it).
  if (Number.isNaN(date.getTime())) return undefined;
  // UTC: the stored instant's calendar day, the same for every viewer.
  return new Intl.DateTimeFormat(getLocale(), {
    dateStyle: "medium",
    timeZone: "UTC",
  }).format(date);
};

/** Map a profile role to its localized label. */
export const roleLabel = (role: ProfileRole | string): string => {
  switch (role) {
    case "ADMIN":
      return m.role_admin();
    case "USER":
      return m.role_user();
    default:
      // Unknown/unhandled roles fall back to the least-privileged label.
      return m.role_user();
  }
};
