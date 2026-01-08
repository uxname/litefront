import { routeTree } from "@generated/routeTree.gen.ts";
import { NotFoundPage } from "@pages/404";
import { AuthProvider, oidcConfig, useAuth } from "@shared/auth";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { GlobalErrorBoundary } from "./app/providers/GlobalErrorBoundary.tsx";

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
