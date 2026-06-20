import type { FC, ReactNode } from "react";
import { AuthContext, type AuthContextProps } from "react-oidc-context";

interface NeutralAuthProviderProps {
  children: ReactNode;
}

/**
 * SSR-safe, always-unauthenticated auth context.
 *
 * `react-oidc-context`'s real `AuthProvider` (and `oidc-client-ts` underneath
 * it) touch `window`/`localStorage`, so they cannot run during server render.
 * On the server we render this neutral provider instead: `useAuth()` resolves to
 * a logged-out, settled state (`isLoading: false`) and every method is a no-op.
 *
 * This is what makes "SSR the public shell, hydrate auth on the client" work:
 * the server emits the anonymous markup, and the real provider takes over on the
 * client. To avoid a hydration mismatch, auth-dependent islands must render the
 * same logged-out markup on their first client paint (see HeaderControls, which
 * treats `isLoading` as logged-out).
 */
export const NeutralAuthProvider: FC<NeutralAuthProviderProps> = ({
  children,
}) => {
  const value = {
    isAuthenticated: false,
    isLoading: false,
    user: undefined,
    signinRedirect: async () => {},
    signoutRedirect: async () => {},
    signinPopup: async () => undefined,
    signinSilent: async () => undefined,
    signinResourceOwnerCredentials: async () => undefined,
    signoutPopup: async () => {},
    signoutSilent: async () => {},
    removeUser: async () => {},
    revokeTokens: async () => {},
    startSilentRenew: () => {},
    stopSilentRenew: () => {},
    clearStaleState: async () => {},
    querySessionStatus: async () => undefined,
    events: {
      addSilentRenewError: () => {},
      removeSilentRenewError: () => {},
      addUserLoaded: () => {},
      removeUserLoaded: () => {},
      addUserUnloaded: () => {},
      removeUserUnloaded: () => {},
      addAccessTokenExpiring: () => {},
      removeAccessTokenExpiring: () => {},
      addAccessTokenExpired: () => {},
      removeAccessTokenExpired: () => {},
      addUserSessionChanged: () => {},
      removeUserSessionChanged: () => {},
    } as unknown as AuthContextProps["events"],
    settings: {} as AuthContextProps["settings"],
    activeNavigator: undefined,
    error: undefined,
  } as unknown as AuthContextProps;

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
