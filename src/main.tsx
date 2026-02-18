import { AuthProvider, oidcConfig, useAuth } from "@features/auth";
import { routeTree } from "@generated/routeTree.gen.ts";
import { NotFoundPage } from "@pages/404";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { initSentry, setUser } from "@shared/lib/sentry";
import { GlobalErrorBoundary } from "./app/providers/GlobalErrorBoundary.tsx";

initSentry();

if (import.meta.env.DEV) {
  import("react-scan").then(({ scan }) => {
    scan({
      enabled: true,
      log: true,
    });
  });
}

const router = createRouter({
  routeTree,
  defaultNotFoundComponent: NotFoundPage,
  context: {
    auth: undefined!,
  },
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const onSigninCallback = () => {
  window.history.replaceState({}, document.title, window.location.pathname);
  router.navigate({ to: "/", replace: true });
};

const App = () => {
  const auth = useAuth();

  useEffect(() => {
    if (auth.user) {
      setUser({
        id: auth.user.profile.sub,
        email: auth.user.profile.email,
        username: auth.user.profile.preferred_username,
      });
    } else {
      setUser(null);
    }
  }, [auth.user]);

  if (auth.isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <span className="loading loading-spinner"></span>
      </div>
    );
  }

  return <RouterProvider router={router} context={{ auth }} />;
};

ReactDOM.createRoot(document.querySelector("#root")!).render(
  <React.StrictMode>
    <GlobalErrorBoundary>
      <AuthProvider {...oidcConfig} onSigninCallback={onSigninCallback}>
        <App />
      </AuthProvider>
    </GlobalErrorBoundary>
  </React.StrictMode>,
);
