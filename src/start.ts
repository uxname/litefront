import { createStart } from "@tanstack/react-start";

// Start instance options. `defaultSsr: true` makes server rendering the default
// for every route; auth-only routes opt out per-route with `ssr: false`
// (see routes/account.tsx, routes/callback.tsx). This is the supported place to
// set defaultSsr — `createRouter` does not accept it.
export const startInstance = createStart(() => ({
  defaultSsr: true,
}));
