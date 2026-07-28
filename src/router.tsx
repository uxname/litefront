import { NotFoundPage } from "@pages/404";
import { PageLoader } from "@shared/ui/PageLoader";
import { createRouter as createTanStackRouter } from "@tanstack/react-router";
import { AppProviders } from "./app/bootstrap/AppProviders";
import { setAppRouter } from "./app/bootstrap/router-instance";
import { routeTree } from "./generated/routeTree.gen";

/**
 * Router factory consumed by TanStack Start (the plugin imports `getRouter`
 * from this module for both the SSR handler and client hydration).
 *
 * - SSR is on by default (set via `defaultSsr` in src/start.ts); auth-only
 *   routes opt out per-route with `ssr: false` (see routes/account.tsx,
 *   routes/callback.tsx).
 * - `Wrap: AppProviders` injects the isomorphic auth + GraphQL providers above
 *   RouterProvider, since Start owns RouterProvider and we can't wrap it in the
 *   entry files.
 */
export function getRouter() {
  const router = createTanStackRouter({
    routeTree,
    defaultNotFoundComponent: NotFoundPage,
    defaultPendingComponent: PageLoader,
    scrollRestoration: true,
    Wrap: ({ children }) => <AppProviders>{children}</AppProviders>,
  });

  // Client-only: expose the instance for config-level callbacks (OIDC
  // onSigninCallback) that need to navigate. No-op effect on the server.
  if (typeof document !== "undefined") {
    setAppRouter(router);
  }

  return router;
}

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof getRouter>;
  }
}
