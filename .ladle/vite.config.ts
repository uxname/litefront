import { fileURLToPath } from "node:url";
import { paraglideVitePlugin } from "@inlang/paraglide-js";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

// Path to the frontend root (parent of this `.ladle` folder), with a trailing
// slash. Ladle resolves user vite configs from its own package directory, so
// relative paths here are unreliable — we build absolute ones instead.
const root = fileURLToPath(new URL("..", import.meta.url));

// Dedicated Vite config for Ladle (Storybook).
//
// The production `vite.config.ts` is intentionally NOT reused: Ladle would load
// it via `loadConfigFromFile` and merge every plugin, which breaks startup:
//   1. `tanstackRouter()` scans a routes directory relative to Ladle's own app
//      root inside node_modules → `ENOENT: scandir .../typings-for-build/app/src/routes`.
//   2. The rolldown-based `@vitejs/plugin-react` (Vite 8) is incompatible with
//      the Vite 6 bundled inside `@ladle/react` → `Missing field moduleType`.
//
// Ladle injects its own React (Vite-6-compatible) and tsconfig-paths plugins
// when the user config doesn't provide them, so we only add what stories
// actually need: Tailwind and Paraglide (i18n messages used by components).
export default defineConfig({
  plugins: [
    tailwindcss(),
    paraglideVitePlugin({
      project: `${root}project.inlang`,
      outdir: `${root}src/generated/paraglide`,
      strategy: ["localStorage", "preferredLanguage", "baseLocale"],
    }),
  ],
});
