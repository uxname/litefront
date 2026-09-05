import { fileURLToPath } from "node:url";
import { paraglideVitePlugin } from "@inlang/paraglide-js";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, type Plugin } from "vite";

// Path to the frontend root (parent of this `.ladle` folder), with a trailing
// slash. Ladle resolves user vite configs from its own package directory, so
// relative paths here are unreliable — we build absolute ones instead.
const root = fileURLToPath(new URL("..", import.meta.url));

// Name of the global `@shared/config` reads the public values from. Spelled out
// rather than imported: importing that module here would run the very code this
// plugin works around. It is a contract with `src/shared/config/env.ts` and
// `src/routes/__root.tsx`, which publishes it from the SSR <head>.
const RUNTIME_CONFIG_GLOBAL = "__LITEFRONT_RUNTIME_CONFIG__";

// Placeholder values, deliberately unusable: `.invalid` is reserved by RFC 2606
// and resolves nowhere, so a story can never reach a real backend or a real
// identity provider. The four optional values are left out on purpose — the
// schema defaults them to "".
const storyRuntimeConfig = {
  VITE_OIDC_AUTHORITY: "https://oidc.ladle.invalid",
  VITE_OIDC_CLIENT_ID: "ladle-placeholder-client",
  VITE_OIDC_REDIRECT_URI: "https://ladle.invalid/callback",
  VITE_OIDC_SCOPE: "openid profile",
  VITE_GRAPHQL_API_URL: "https://api.ladle.invalid/graphql",
};

// Publishes that global into the story page's <head>.
//
// Ladle has no SSR server in front of the stories, so nothing defines the
// global and `@shared/config` throws while it is being imported — which blanks
// the canvas of EVERY story of every component that touches the config, and
// takes the component's whole story file with it. Fixing that class of failure
// here rather than in one component is deliberate: `shared/ui` components are
// required to have a story, so the next one that imports the config would
// otherwise be silently broken again.
//
// Note that `ladle build` cannot catch this on its own — the throw happens
// while the story renders, not while it bundles, so the build stays green.
const runtimeConfigPlugin = (): Plugin => ({
  name: "ladle-story-runtime-config",
  transformIndexHtml: () => [
    {
      tag: "script",
      injectTo: "head-prepend",
      children: `window.${RUNTIME_CONFIG_GLOBAL}=${JSON.stringify(storyRuntimeConfig)};`,
    },
  ],
});

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
// actually need: the runtime config above, Tailwind, and Paraglide (i18n
// messages used by components).
export default defineConfig({
  plugins: [
    runtimeConfigPlugin(),
    tailwindcss(),
    paraglideVitePlugin({
      project: `${root}project.inlang`,
      outdir: `${root}src/generated/paraglide`,
      strategy: ["localStorage", "preferredLanguage", "baseLocale"],
    }),
  ],
});
