import { fileURLToPath } from "node:url";

/** @type {import('@ladle/react').UserConfig} */
export default {
  stories: "src/**/*.stories.{js,jsx,ts,tsx}",
  // Use a dedicated, minimal Vite config instead of the production one
  // (see .ladle/vite.config.ts for why).
  viteConfig: fileURLToPath(new URL("./vite.config.ts", import.meta.url)),
};
