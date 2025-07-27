/// <reference types="vitest" />

import tailwindcss from "@tailwindcss/vite";
import { TanStackRouterVite } from "@tanstack/router-vite-plugin";
import react from "@vitejs/plugin-react";
import { configDotenv } from "dotenv";
import { UserConfig } from "vite";
import { ViteImageOptimizer } from "vite-plugin-image-optimizer";
import { vitePluginVersionMark } from "vite-plugin-version-mark";
import tsconfigPaths from "vite-tsconfig-paths";
import { viteDotenvChecker } from "./src/app/vite-dotenv-checker.plugin";

// https://vitejs.dev/config/
const viteConfig = (): UserConfig => {
  configDotenv();

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
      tailwindcss(),
      tsconfigPaths(),
      react(),
      ViteImageOptimizer(),
      TanStackRouterVite({
        generatedRouteTree: "./src/generated/routeTree.gen.ts",
      }),
      vitePluginVersionMark({
        ifLog: true,
        ifGlobal: true,
        command: 'git log -1 --pretty=format:"%H %s"',
      }),
      viteDotenvChecker(),
    ],
    build: {
      sourcemap: true,
      rollupOptions: {
        // hacky for hiding warning on ant design building: https://github.com/vitejs/vite/issues/15012#issuecomment-1815854072
        onLog(level, log, handler): void {
          if (
            log.message.includes("node_modules/antd/") &&
            log.message.includes(
              "Error when using sourcemap for reporting an error: Can't resolve original location of error.",
            )
          ) {
            return;
          }
          handler(level, log);
        },
      },
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

export default viteConfig;
