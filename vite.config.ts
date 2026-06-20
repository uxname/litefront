import { paraglideVitePlugin } from "@inlang/paraglide-js";
import { sentryVitePlugin } from "@sentry/vite-plugin";
import tailwindcss from "@tailwindcss/vite";
import { nitroV2Plugin } from "@tanstack/nitro-v2-vite-plugin";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import react from "@vitejs/plugin-react";
import { configDotenv } from "dotenv";
import { visualizer } from "rollup-plugin-visualizer";
import { defineConfig, type UserConfig } from "vite";
import { ViteImageOptimizer } from "vite-plugin-image-optimizer";
import { VitePWA } from "vite-plugin-pwa";
import { stripDanglingSourcemaps } from "./src/app/strip-dangling-sourcemaps.plugin";
import { viteDotenvChecker } from "./src/app/vite-dotenv-checker.plugin";

export default defineConfig(async (): Promise<UserConfig> => {
  configDotenv({ quiet: true });

  const port = Number(process.env.PORT) || 3000;

  return {
    server: {
      port,
      strictPort: true,
      host: process.env.CI ? "0.0.0.0" : "localhost",
    },
    preview: {
      port,
      strictPort: true,
    },
    build: {
      sourcemap: process.env.NODE_ENV !== "production",
      target: "esnext",
    },
    resolve: {
      tsconfigPaths: true,
    },
    plugins: [
      // Dev-only: silence ENOENT "Failed to load source map" noise from
      // @tanstack/*-start* packages that ship dangling sourcemap comments.
      // Must run before tanstackStart (which pulls those packages into Vite).
      stripDanglingSourcemaps(),
      // TanStack Start replaces the standalone router plugin: it owns route
      // generation (tsr settings below) AND wires the SSR client/server entries
      // (src/client.tsx, src/server.ts, src/router.tsx). The default Nitro
      // target is `node-server`, which is what the Dockerfile runs.
      tanstackStart({
        // Paths under `router` are resolved relative to the src directory
        // ("src"), so this writes to src/generated/routeTree.gen.ts.
        router: {
          generatedRouteTree: "generated/routeTree.gen.ts",
          autoCodeSplitting: true,
          quoteStyle: "double",
          semicolons: false,
        },
      }),
      // Builds a standalone Node SSR server to .output/server/index.mjs (run via
      // `npm run start:prod`). routeRules reproduce the security + caching headers
      // the previous Caddy static host set; compressPublicAssets restores gzip/br
      // for static files (the SSR HTML stream is best compressed by a fronting
      // proxy in production).
      nitroV2Plugin({
        preset: "node-server",
        // Pin the Nitro feature-flag baseline so a Nitro upgrade can't silently
        // change preset behavior. Without it Nitro falls back to an old implicit
        // date and warns on every build.
        compatibilityDate: "2026-06-20",
        compressPublicAssets: { gzip: true, brotli: true },
        routeRules: {
          "/**": {
            headers: {
              "X-Frame-Options": "DENY",
              "X-Content-Type-Options": "nosniff",
            },
          },
          "/assets/**": {
            headers: {
              "Cache-Control": "public, max-age=31536000, immutable",
            },
          },
        },
      }),
      tailwindcss(),
      paraglideVitePlugin({
        project: "./project.inlang",
        outdir: "./src/generated/paraglide",
        // cookie + localStorage first so an explicit user choice
        // (LocaleSwitcher → setLocale, which writes BOTH) persists and wins over
        // the browser language on reload. `cookie` is the only writable strategy
        // the SSR server can read, so it keeps server render and client in sync
        // (no hydration mismatch); `localStorage` keeps the pre-SSR behavior on
        // the client; `preferredLanguage` is the first-visit default; `baseLocale`
        // ("en") is the final fallback.
        strategy: ["cookie", "localStorage", "preferredLanguage", "baseLocale"],
      }),
      ViteImageOptimizer(),
      react({
        babel: {
          plugins: ["babel-plugin-react-compiler"],
        },
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
      sentryVitePlugin({
        org: process.env.VITE_SENTRY_ORG,
        project: process.env.VITE_SENTRY_PROJECT,
        authToken: process.env.VITE_SENTRY_AUTH_TOKEN,
        sourcemaps: {
          filesToDeleteAfterUpload: ["**/*.map"],
        },
      }),
      process.env.ANALYZE === "true" &&
        visualizer({
          emitFile: true,
          filename: "_stats.html",
          template: "flamegraph",
        }),
    ].filter(Boolean),
    css: {
      modules: {
        // Enable CSS Modules for all .scss files
        localsConvention: "camelCaseOnly",
      },
    },
  };
});
