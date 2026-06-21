import type { AuthContextProps } from "react-oidc-context";

/**
 * Build a settled, logged-out `AuthContextProps` stub whose every method is a
 * no-op. Shared by the SSR-safe {@link NeutralAuthProvider} and the E2E/dev
 * {@link MockAuthProvider} so the (large) `react-oidc-context` surface is
 * stubbed in exactly one place; each provider only overrides what differs.
 */
export const createStubAuthValue = (
  overrides?: Partial<AuthContextProps>,
): AuthContextProps =>
  ({
    isAuthenticated: false,
    isLoading: false,
    user: undefined,
    signinRedirect: async () => {},
    signoutRedirect: async () => {},
    signinResourceOwnerCredentials: async () => undefined,
    signinPopup: async () => undefined,
    signinSilent: async () => undefined,
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
    ...overrides,
  }) as unknown as AuthContextProps;
