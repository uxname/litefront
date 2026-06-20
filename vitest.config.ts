import { defineConfig } from "vitest/config";

// Vitest runs in its own config — WITHOUT the TanStack Start plugin — so unit
// and component tests execute in a plain jsdom environment, unaffected by the
// SSR route/server transforms Start applies during dev/build.
export default defineConfig({
  resolve: {
    tsconfigPaths: true,
  },
  test: {
    // E2E (Playwright) lives under tests/e2e and is excluded here; everything
    // else — co-located src/**/*.test.*, tests/unit/**, tests/component/**,
    // tests/sum.test.ts — is picked up by Vitest's defaults.
    exclude: ["tests/e2e", "node_modules", "dist", ".output", ".opencode"],
    testTimeout: 30_000,
    hookTimeout: 30_000,
    environment: "jsdom",
    globals: true,
    setupFiles: ["./tests/setup.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      // Floors calibrated from a real `npm run test:cov` run (~84% lines /
      // 82% branches / 89% funcs at calibration). Ratchet these UP as coverage
      // grows — never lower one to dodge a finding; add the missing test.
      thresholds: {
        lines: 82,
        functions: 85,
        branches: 78,
        statements: 82,
      },
      exclude: [
        "node_modules/",
        "src/generated/",
        "tests/",
        "**/*.d.ts",
        "**/*.config.*",
        "**/*.stories.*",
        // Entry points and global providers (covered by E2E)
        "src/client.tsx",
        "src/server.ts",
        "src/router.tsx",
        "src/start.ts",
        "src/routes/__root.tsx",
        "src/app/providers/**",
        // Third-party library adapters and configs (no business logic)
        "src/shared/lib/sentry/**",
        "src/shared/config/**",
        "src/features/auth/api/oidc-client.ts",
        // Test-only / SSR-neutral mock providers
        "src/features/auth/ui/MockAuthProvider.tsx",
        "src/features/auth/ui/NeutralAuthProvider.tsx",
      ],
    },
  },
});
