import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'
import {ViteImageOptimizer} from "vite-plugin-image-optimizer";
import {VitePWA} from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({registerType: "autoUpdate"}),
    ViteImageOptimizer(),],
  build: {
    sourcemap: true,
  }
})
