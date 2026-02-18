import { paraglideVitePlugin } from "@inlang/paraglide-js";
import { sentryVitePlugin } from "@sentry/vite-plugin";
import tailwindcss from "@tailwindcss/vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react";
import { configDotenv } from "dotenv";
import { visualizer } from "rollup-plugin-visualizer";
import { UserConfig } from "vite";
import { ViteImageOptimizer } from "vite-plugin-image-optimizer";
import { VitePWA } from "vite-plugin-pwa";
import sitemap from "vite-plugin-sitemap";
import { vitePluginVersionMark } from "vite-plugin-version-mark";
import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";
import { viteDotenvChecker } from "./src/app/vite-dotenv-checker.plugin";

export default defineConfig(async (): Promise<UserConfig> => {
  configDotenv({ quiet: true });

  const port = Number(process.env.PORT) || 3000;
  const hostname = process.env.VITE_BASE_URL || "http://localhost:3000";

  return {
    server: {
      port,
      strictPort: true,
      host: "0.0.0.0",
    },
    preview: {
      port,
      strictPort: true,
    },
    build: {
      sourcemap: true,
      target: "esnext",
      rollupOptions: {
        output: {
          manualChunks(id: string) {
            if (!id.includes("node_modules")) {
              return;
            }

            if (
              /[\\/]node_modules[\\/](react|react-dom|scheduler|use-sync-external-store|zustand)[\\/]/.test(
                id,
              )
            ) {
              return "vendor-react";
            }

            if (id.includes("@tanstack")) {
              return "vendor-router";
            }

            if (
              id.includes("urql") ||
              id.includes("wonka") ||
              id.includes("graphql")
            ) {
              return "vendor-api";
            }

            if (
              id.includes("oidc-client-ts") ||
              id.includes("react-oidc-context")
            ) {
              return "vendor-auth";
            }
          },
        },
      },
    },
    plugins: [
      sentryVitePlugin({
        org: process.env.VITE_SENTRY_ORG,
        project: process.env.VITE_SENTRY_PROJECT,
        authToken: process.env.VITE_SENTRY_AUTH_TOKEN,
        sourcemaps: {
          filesToDeleteAfterUpload: ["**/*.map"],
        },
      }),
      paraglideVitePlugin({
        project: "./project.inlang",
        outdir: "./src/generated/paraglide",
        strategy: ["preferredLanguage"],
      }),
      tailwindcss(),
      tsconfigPaths(),
      ViteImageOptimizer(),
      tanstackRouter(),
      sitemap({
        hostname,
        robots: [
          {
            userAgent: "*",
            allow: "/",
            disallow: ["/callback", "/protected", "/404"],
          },
        ],
      }),
      react({
        babel: {
          plugins: ["babel-plugin-react-compiler"],
        },
      }),
      vitePluginVersionMark({
        ifLog: true,
        ifGlobal: true,
        ifMeta: false,
        command: 'git log -1 --pretty=format:"%H %s"',
      }),
      viteDotenvChecker(),
      VitePWA({
        disable: true, // enable when PWA is needed
        registerType: "autoUpdate",
        includeAssets: ["favicon.ico", "apple-touch-icon.png"],
        manifest: {
          name: "LiteFront App",
          short_name: "LiteFront",
          description: "A modern React application",
          theme_color: "#ffffff",
          icons: [
            {
              src: "pwa-192x192.png",
              sizes: "192x192",
              type: "image/png",
            },
            {
              src: "pwa-512x512.png",
              sizes: "512x512",
              type: "image/png",
            },
          ],
        },
        devOptions: {
          enabled: true,
        },
      }),
      visualizer({
        emitFile: true,
        filename: "_stats.html",
        template: "flamegraph",
      }),
    ],
    test: {
      exclude: ["tests/e2e", "node_modules", "dist"],
      testTimeout: 30_000,
      hookTimeout: 30_000,
      environment: "jsdom",
      globals: true,
      setupFiles: ["./tests/setup.ts"],
      coverage: {
        provider: "v8",
        reporter: ["text", "json", "html"],
        thresholds: {
          lines: 80,
          functions: 80,
          branches: 70,
          statements: 80,
        },
        exclude: [
          "node_modules/",
          "src/generated/",
          "tests/",
          "**/*.d.ts",
          "**/*.config.*",
          "**/*.stories.*",
        ],
      },
    },
    css: {
      modules: {
        // Enable CSS Modules for all .scss files
        localsConvention: "camelCaseOnly",
      },
    },
  };
});
