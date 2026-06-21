import { type FC, type ReactNode, useEffect, useState } from "react";
import { AuthContext, type AuthContextProps } from "react-oidc-context";
import { createStubAuthValue } from "../lib/stub-auth-value";

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
  // Start logged-out so the first client render matches the server's
  // unauthenticated SSR markup (NeutralAuthProvider), then read the persisted
  // test flag in an effect — mirroring how the real OIDC provider resolves
  // asynchronously after mount. This keeps SSR'd public pages hydration-clean.
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    setIsAuthenticated(localStorage.getItem("isTestAuthenticated") === "true");
  }, []);

  // Reuse the shared stub and override only what the mock changes: the auth
  // state, the resolved user, and a sign-out that clears the test flag.
  const value = createStubAuthValue({
    isAuthenticated,
    user: isAuthenticated
      ? (MOCK_USER as unknown as AuthContextProps["user"])
      : undefined,
    signoutRedirect: async () => {
      localStorage.removeItem("isTestAuthenticated");
      sessionStorage.setItem("__logged_out__", "true");
      setIsAuthenticated(false);
    },
  });

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
