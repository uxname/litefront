import "@testing-library/jest-dom";
import { vi } from "vitest";

// Mock window.matchMedia
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock environment variables
vi.stubGlobal("import.meta", {
  env: {
    VITE_GRAPHQL_API_URL: "http://localhost:4000/graphql",
    VITE_OIDC_AUTHORITY: "https://test.oidc.com",
    VITE_OIDC_CLIENT_ID: "test-client",
    VITE_OIDC_REDIRECT_URI: "http://localhost:3000/callback",
    VITE_OIDC_SCOPE: "openid profile",
    VITE_BASE_URL: "http://localhost:3000",
    DEV: true,
    PROD: false,
  },
});

// Global mock: i18n messages — prevents missing-translation crashes in all component tests.
// A Proxy returns a function echoing the key name for ANY message, so adding a new
// Paraglide key never breaks tests that rely on this global mock. Tests needing specific
// strings override this with their own `vi.mock("@generated/paraglide/messages", …)`.
vi.mock("@generated/paraglide/messages", () => ({
  m: new Proxy(
    {},
    {
      get: (_target, prop) =>
        typeof prop === "string" ? () => prop : undefined,
    },
  ),
}));

// Global mock: OIDC — default unauthenticated state; override per test via vi.mocked(useAuth).mockReturnValue(...)
vi.mock("react-oidc-context", () => ({
  useAuth: vi.fn(() => ({
    isAuthenticated: false,
    isLoading: false,
    user: null,
    signinRedirect: vi.fn(),
    signoutRedirect: vi.fn(),
  })),
  AuthProvider: ({ children }: { children: unknown }) => children,
  AuthContext: { Provider: ({ children }: { children: unknown }) => children },
}));
