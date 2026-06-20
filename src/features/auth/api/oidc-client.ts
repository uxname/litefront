import { env } from "@shared/config";
import { WebStorageStateStore } from "oidc-client-ts";
import { AuthProviderProps } from "react-oidc-context";

/**
 * Build the OIDC provider config. This is a **function, not a top-level const**,
 * on purpose: it dereferences `window.localStorage` (via `WebStorageStateStore`),
 * which does not exist during SSR. Constructing it lazily — only when the real
 * `AuthProvider` mounts on the client — keeps this module safe to import on the
 * server (the server renders {@link NeutralAuthProvider} instead).
 */
export const getOidcConfig = (): AuthProviderProps => ({
  authority: env.VITE_OIDC_AUTHORITY,
  client_id: env.VITE_OIDC_CLIENT_ID,
  redirect_uri: env.VITE_OIDC_REDIRECT_URI,
  post_logout_redirect_uri: env.VITE_BASE_URL,
  scope: env.VITE_OIDC_SCOPE,
  // Request the access_token for the backend API resource so its `aud` matches
  // the server's OIDC_AUDIENCE (OAuth2-correct token for API calls).
  // `resource` is sent on the authorize request; `extraTokenParams.resource`
  // repeats it on the token exchange — Logto requires it on BOTH or it falls
  // back to issuing an opaque OP token the backend can't verify.
  ...(env.VITE_OIDC_API_RESOURCE
    ? {
        resource: env.VITE_OIDC_API_RESOURCE,
        extraTokenParams: { resource: env.VITE_OIDC_API_RESOURCE },
      }
    : {}),
  automaticSilentRenew: true,
  userStore: new WebStorageStateStore({ store: window.localStorage }),
});

export type { AuthContextProps } from "react-oidc-context";
export { AuthProvider, useAuth } from "react-oidc-context";
