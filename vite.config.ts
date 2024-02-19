// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable new-cap */
import { TanStackRouterVite } from "@tanstack/router-vite-plugin";
import react from "@vitejs/plugin-react";
import { configDotenv } from "dotenv";
import { UserConfig } from "vite";
import { ViteImageOptimizer } from "vite-plugin-image-optimizer";
import { vitePluginVersionMark } from "vite-plugin-version-mark";

import { viteDotenvChecker } from "./src/common/vite-dotenv-checker.plugin";

// https://vitejs.dev/config/
export default (): UserConfig => {
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
  };
};
