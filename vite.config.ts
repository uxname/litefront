// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable new-cap */
import { TanStackRouterVite } from "@tanstack/router-vite-plugin";
import react from "@vitejs/plugin-react";
import { configDotenv } from "dotenv";
import { UserConfig } from "vite";
import { ViteImageOptimizer } from "vite-plugin-image-optimizer";
import { VitePWA } from "vite-plugin-pwa";

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
      VitePWA({ registerType: "autoUpdate" }),
      ViteImageOptimizer(),
      TanStackRouterVite({
        generatedRouteTree: "./src/generated/routeTree.gen.ts",
      }),
    ],
    build: {
      sourcemap: true,
    },
  };
};
