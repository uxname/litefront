import { env } from "@shared/config";
import { WebStorageStateStore } from "oidc-client-ts";
import { AuthProviderProps } from "react-oidc-context";

export const oidcConfig: AuthProviderProps = {
  authority: env.VITE_OIDC_AUTHORITY,
  client_id: env.VITE_OIDC_CLIENT_ID,
  redirect_uri: env.VITE_OIDC_REDIRECT_URI,
  post_logout_redirect_uri: env.VITE_BASE_URL,
  scope: env.VITE_OIDC_SCOPE,
  // Request the access_token for the backend API resource so its `aud` matches
  // the server's OIDC_AUDIENCE (OAuth2-correct token for API calls).
  ...(env.VITE_OIDC_API_RESOURCE
    ? { resource: env.VITE_OIDC_API_RESOURCE }
    : {}),
  automaticSilentRenew: true,
  userStore: new WebStorageStateStore({ store: window.localStorage }),
};

export type { AuthContextProps } from "react-oidc-context";
export { AuthProvider, useAuth } from "react-oidc-context";
