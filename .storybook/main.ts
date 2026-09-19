import type { StorybookConfig } from "@storybook/react-vite";

const config: StorybookConfig = {
  stories: ["../src/**/*.stories.@(ts|tsx)"],
  framework: {
    name: "@storybook/react-vite",
    options: {
      builder: {
        // A dedicated, minimal Vite config. Without this line Storybook loads the
        // production `vite.config.ts` and merges every plugin in it — TanStack
        // Start, Nitro, Sentry, the PWA plugin — none of which a component
        // workshop can run.
        viteConfigPath: ".storybook/vite.config.ts",
      },
    },
  },
  core: {
    // There is no CI and no network dependency in any gate (meta ADR-0001):
    // `storybook build` runs inside the pre-push hook and must not phone home.
    disableTelemetry: true,
    disableWhatsNewNotifications: true,
  },
  typescript: {
    // No docs addon is installed, so the prop tables docgen exists for are never
    // rendered. Off keeps the build away from the TypeScript compiler API.
    reactDocgen: false,
  },
};

export default config;
