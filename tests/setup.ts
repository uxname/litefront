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
