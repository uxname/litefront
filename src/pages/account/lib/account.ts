import type { AccountAction } from "@features/auth";
import type { MeQuery, ProfileRole } from "@generated/graphql";
import { m } from "@generated/paraglide/messages";
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
 * Format the backend `createdAt` timestamp as a locale date string, or
 * `undefined` when there is no value to format.
 */
export const formatMemberSince = (
  createdAt: Me["createdAt"] | null | undefined,
): string | undefined =>
  createdAt ? new Date(String(createdAt)).toLocaleDateString() : undefined;

/** Map a profile role to its localized label. */
export const roleLabel = (role: ProfileRole | string): string =>
  role === "ADMIN" ? m.role_admin() : m.role_user();
