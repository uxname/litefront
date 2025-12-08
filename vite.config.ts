import { paraglideVitePlugin } from "@inlang/paraglide-js";
import tailwindcss from "@tailwindcss/vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react";
import { configDotenv } from "dotenv";
import { UserConfig } from "vite";
import { ViteImageOptimizer } from "vite-plugin-image-optimizer";
import { VitePWA } from "vite-plugin-pwa";
import { vitePluginVersionMark } from "vite-plugin-version-mark";
import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";
import { viteDotenvChecker } from "./src/app/vite-dotenv-checker.plugin";

export default defineConfig(async (_): Promise<UserConfig> => {
  configDotenv({ quiet: true });

  const port = Number(process.env.PORT);

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
    plugins: [
      paraglideVitePlugin({
        project: "./project.inlang",
        outdir: "./src/generated/paraglide",
        strategy: ["preferredLanguage"],
      }),
      tailwindcss(),
      tsconfigPaths(),
      ViteImageOptimizer(),
      tanstackRouter({
        target: "react",
        autoCodeSplitting: true,
        generatedRouteTree: "./src/generated/routeTree.gen.ts",
      }),
      react({
        babel: {
          plugins: ["babel-plugin-react-compiler"],
        },
      }),
      vitePluginVersionMark({
        ifLog: true,
        ifGlobal: true,
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
    ],
    build: {
      sourcemap: true,
    },
    test: {
      exclude: ["tests/e2e", "node_modules", "dist"],
      testTimeout: 30_000,
      hookTimeout: 30_000,
    },
    css: {
      modules: {
        // Enable CSS Modules for all .scss files
        localsConvention: "camelCaseOnly",
      },
    },
  };
});
