// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable new-cap */
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
    },
    preview: {
      port: Number(process.env.PORT),
      strictPort: true,
    },
    plugins: [
      react(),
      VitePWA({ registerType: "autoUpdate" }),
      ViteImageOptimizer(),
    ],
    build: {
      sourcemap: true,
    },
  };
};
