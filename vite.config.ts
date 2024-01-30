// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable new-cap */
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { ViteImageOptimizer } from "vite-plugin-image-optimizer";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({ registerType: "autoUpdate" }),
    ViteImageOptimizer(),
  ],
  build: {
    sourcemap: true,
  },
});
