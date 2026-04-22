import { type FC, type ReactNode, useState } from "react";
import { AuthContext, type AuthContextProps } from "react-oidc-context";

interface MockAuthProviderProps {
  children: ReactNode;
}

const MOCK_USER = {
  profile: {
    sub: "test-user-123",
    email: "test@example.com",
    preferred_username: "testuser",
    name: "Test User",
  },
  access_token: "mock-access-token",
  id_token: "mock-id-token",
  expires_at: Math.floor(Date.now() / 1000) + 3600,
  expires_in: 3600,
  token_type: "Bearer",
  scope: "openid profile",
  session_state: null,
  toStorageString: () => "{}",
} as const;

export const MockAuthProvider: FC<MockAuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => localStorage.getItem("isTestAuthenticated") === "true",
  );

  const value = {
    isAuthenticated,
    isLoading: false,
    user: isAuthenticated ? MOCK_USER : undefined,
    signinRedirect: async () => {},
    signoutRedirect: async () => {
      localStorage.removeItem("isTestAuthenticated");
      sessionStorage.setItem("__logged_out__", "true");
      setIsAuthenticated(false);
    },
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
    events: {} as AuthContextProps["events"],
    settings: {} as AuthContextProps["settings"],
    activeNavigator: undefined,
    error: undefined,
  } as unknown as AuthContextProps;

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
