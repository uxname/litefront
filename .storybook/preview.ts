import type { Preview } from "@storybook/react-vite";

// The app's global stylesheet (Tailwind + the daisyUI themes), so a story renders
// with exactly the styling the real app has.
import "../src/index.css";

// `@shared/config` reads the public runtime values from this global and throws
// while it is being imported when the global is missing. In the app the SSR
// <head> publishes it; a story has no server in front of it. This module is
// evaluated before any story file is imported, so defining the global here
// covers every component that touches the config — including the next one.
//
// The name is spelled out rather than imported: importing `@shared/config` here
// would run the very code this works around. The values are deliberately
// unusable — `.invalid` is reserved by RFC 2606 and resolves nowhere, so a story
// can never reach a real backend or a real identity provider. The optional
// values are left out on purpose: the schema defaults them to "".
Object.assign(globalThis, {
  __LITEFRONT_RUNTIME_CONFIG__: {
    VITE_OIDC_AUTHORITY: "https://oidc.storybook.invalid",
    VITE_OIDC_CLIENT_ID: "storybook-placeholder-client",
    VITE_OIDC_REDIRECT_URI: "https://storybook.invalid/callback",
    VITE_OIDC_SCOPE: "openid profile",
    VITE_GRAPHQL_API_URL: "https://api.storybook.invalid/graphql",
  },
});

// daisyUI switches theme on the `data-theme` attribute of <html> (see the two
// `@plugin "daisyui/theme"` blocks in src/index.css: "cmyk" is the light one and
// the default, "dark" is the other). The app sets that attribute itself; a story
// has nobody to set it, so without this toolbar every screenshot is a light one
// — and a component that only misbehaves in the dark theme goes unnoticed.
const preview: Preview = {
  globalTypes: {
    theme: {
      description: "daisyUI theme",
      toolbar: {
        title: "Theme",
        icon: "paintbrush",
        items: [
          { value: "cmyk", title: "Light" },
          { value: "dark", title: "Dark" },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: { theme: "cmyk" },
  decorators: [
    (Story, context) => {
      document.documentElement.setAttribute(
        "data-theme",
        context.globals.theme,
      );
      return Story();
    },
  ],
};

export default preview;
