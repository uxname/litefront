import {
  AuthProvider,
  getOidcConfig,
  MockAuthProvider,
  NeutralAuthProvider,
  useAuth,
} from "@features/auth";
import { createGraphQLClient, GraphQLProvider } from "@shared/api";
import { env } from "@shared/config";
import { captureMessage } from "@shared/lib/sentry";
import type { User } from "oidc-client-ts";
import { type FC, type ReactNode, useMemo } from "react";
import { AuthObserver } from "./AuthObserver";
import { GlobalErrorBoundary } from "./GlobalErrorBoundary";
import { getAppRouter } from "./router-instance";

// Resolved once at module load. On the client this is always `false`; on the
// server always `true` — so React hydration sees identical (provider-only,
// no-DOM) wrappers on both sides and only the auth *context value* differs.
const isServer = typeof document === "undefined";
const isMockAuth = env.VITE_MOCK_AUTH === "true";

// biome-ignore lint/suspicious/noConfusingVoidType: matches react-oidc-context's onSigninCallback signature
const onSigninCallback = (user: User | void): void => {
  captureMessage("Auth: sign-in completed", { level: "info" });
  // `state.returnTo` is the path the user was on before sign-in (set by
  // signinRedirect). Bring them back there; fall back to home.
  const state = user?.state;
  const returnTo =
    state &&
    typeof state === "object" &&
    "returnTo" in state &&
    typeof (state as { returnTo?: unknown }).returnTo === "string"
      ? (state as { returnTo: string }).returnTo
      : "/";
  // Replace so the OIDC callback URL (with code/state) drops out of history.
  getAppRouter()?.history.replace(returnTo);
};

/**
 * Picks the auth provider per environment:
 * - server → {@link NeutralAuthProvider} (SSR-safe, always logged-out);
 * - client + `VITE_MOCK_AUTH` → {@link MockAuthProvider} (E2E/dev);
 * - client → real `react-oidc-context` `AuthProvider`.
 *
 * `getOidcConfig()` is called lazily here (client branch only) because it reads
 * `window.localStorage`.
 */
const AuthBoundary: FC<{ children: ReactNode }> = ({ children }) => {
  if (isServer) {
    return <NeutralAuthProvider>{children}</NeutralAuthProvider>;
  }
  if (isMockAuth) {
    return <MockAuthProvider>{children}</MockAuthProvider>;
  }
  return (
    <AuthProvider {...getOidcConfig()} onSigninCallback={onSigninCallback}>
      {children}
    </AuthProvider>
  );
};

/**
 * Rebuilds the URQL client whenever the access token changes so authenticated
 * requests carry the right bearer. Lives below {@link AuthBoundary} so
 * `useAuth()` is always available (neutral context on the server).
 */
const GraphQLBridge: FC<{ children: ReactNode }> = ({ children }) => {
  const auth = useAuth();
  const client = useMemo(
    () => createGraphQLClient(auth.user?.access_token),
    [auth.user?.access_token],
  );
  return <GraphQLProvider value={client}>{children}</GraphQLProvider>;
};

/**
 * Isomorphic provider tree injected via the router's `Wrap` option, so it sits
 * above `RouterProvider` and is shared by every route on both server and client.
 */
export const AppProviders: FC<{ children: ReactNode }> = ({ children }) => (
  <GlobalErrorBoundary>
    <AuthBoundary>
      {/* Headless: wires auth errors / user identity into Sentry. */}
      <AuthObserver />
      <GraphQLBridge>{children}</GraphQLBridge>
    </AuthBoundary>
  </GlobalErrorBoundary>
);
