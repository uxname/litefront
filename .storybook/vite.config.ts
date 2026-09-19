import { paraglideVitePlugin } from "@inlang/paraglide-js";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

// Dedicated Vite config for Storybook (see `viteConfigPath` in ./main.ts for why
// the production one is not reused). It carries only what a story needs:
// the path aliases, Tailwind, and Paraglide for the messages components render.
// Storybook's React framework adds the React plugin itself.
export default defineConfig({
  resolve: {
    tsconfigPaths: true,
  },
  plugins: [
    tailwindcss(),
    paraglideVitePlugin({
      project: "./project.inlang",
      outdir: "./src/generated/paraglide",
      // MUST stay identical to the list in the production `vite.config.ts`. Both
      // configs compile into the same `src/generated/paraglide`, and the strategy
      // is baked into the generated runtime — a different list here would
      // overwrite the app's runtime every time the stories are built.
      strategy: ["cookie", "localStorage", "preferredLanguage", "baseLocale"],
    }),
  ],
});
