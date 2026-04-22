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
    DEV: true,
    PROD: false,
  },
});

// Global mock: i18n messages — prevents missing-translation crashes in all component tests
vi.mock("@generated/paraglide/messages", () => ({
  m: {
    error_generic_title: () => "System Issue",
    error_unexpected: () => "Unexpected Error",
    error_unexpected_desc: () => "An unexpected error occurred",
    error_auth_required: () => "Authentication Required",
    error_auth_desc: () => "Please sign in to continue",
    error_access_denied: () => "Access Denied",
    error_access_desc: () => "You do not have permission",
    error_network: () => "Network Error",
    error_network_desc: () => "Please check your connection",
    error_server: () => "Server Error",
    error_server_desc: () => "The server encountered an error",
    action_retry: () => "Retry",
    action_reload: () => "Reload",
    dev_details: () => "Developer Details",
  },
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
