import { fileURLToPath } from "node:url";

/** @type {import('@ladle/react').UserConfig} */
export default {
  stories: "src/**/*.stories.{js,jsx,ts,tsx}",
  // Single source of truth for the build output dir, shared by `ladle build`
  // and `ladle preview` (its default is "build", which would 404 on preview).
  // Kept in sync with .gitignore / knip / stylelint ignore entries.
  outDir: "storybook-build",
  // Use a dedicated, minimal Vite config instead of the production one
  // (see .ladle/vite.config.ts for why).
  viteConfig: fileURLToPath(new URL("./vite.config.ts", import.meta.url)),
};
