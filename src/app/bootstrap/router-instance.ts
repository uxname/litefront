import type { AnyRouter } from "@tanstack/react-router";

// Client-only handle to the active router. TanStack Start owns the
// RouterProvider (inside StartClient), so config-level callbacks that need to
// navigate — notably the OIDC `onSigninCallback` — can't reach the router via
// hooks. The router entry registers the instance here on the client; callbacks
// read it back. Never set on the server (avoids cross-request leakage).
let router: AnyRouter | undefined;

export const setAppRouter = (instance: AnyRouter): void => {
  router = instance;
};

export const getAppRouter = (): AnyRouter | undefined => router;
