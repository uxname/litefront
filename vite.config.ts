/// <reference types="vitest" />

// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable new-cap */
import { TanStackRouterVite } from "@tanstack/router-vite-plugin";
import react from "@vitejs/plugin-react";
import { configDotenv } from "dotenv";
import { UserConfig } from "vite";
import { ViteImageOptimizer } from "vite-plugin-image-optimizer";
import { vitePluginVersionMark } from "vite-plugin-version-mark";
import tsconfigPaths from "vite-tsconfig-paths";

import { viteDotenvChecker } from "./src/app/vite-dotenv-checker.plugin";

// https://vitejs.dev/config/
const vite = (): UserConfig => {
  configDotenv();

  return {
    server: {
      port: Number(process.env.PORT),
      strictPort: true,
      host: "0.0.0.0",
    },
    preview: {
      port: Number(process.env.PORT),
      strictPort: true,
    },
    plugins: [
      tsconfigPaths(),
      react(),
      ViteImageOptimizer(),
      TanStackRouterVite({
        generatedRouteTree: "./src/generated/routeTree.gen.ts",
      }),
      vitePluginVersionMark({
        ifGitSHA: true,
        ifLog: true,
        ifGlobal: true,
      }),
      viteDotenvChecker(),
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
};
export default vite;
