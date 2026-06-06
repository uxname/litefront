import { AuthProvider, oidcConfig, useAuth } from "@features/auth";
import { MockAuthProvider } from "@features/auth/ui/MockAuthProvider";
import { routeTree } from "@generated/routeTree.gen.ts";
import { NotFoundPage } from "@pages/404";
import { env } from "@shared/config";
import {
  captureException,
  captureMessage,
  initSentry,
  setUser,
} from "@shared/lib/sentry";
import { ErrorFallback } from "@shared/ui/ErrorFallback";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
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
  captureMessage("Auth: sign-in completed", { level: "info" });
  window.history.replaceState({}, document.title, window.location.pathname);
  router.navigate({ to: "/", replace: true });
};

const App = () => {
  const auth = useAuth();

  useEffect(() => {
    if (auth.error) {
      captureException(auth.error);
    }
  }, [auth.error]);

  useEffect(() => {
    if (!auth.events?.addSilentRenewError) return;
    const handler = (error: Error) => {
      captureException(error);
    };
    auth.events.addSilentRenewError(handler);
    return () => {
      auth.events.removeSilentRenewError(handler);
    };
  }, [auth.events]);

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

  if (auth.error) {
    return (
      <ErrorFallback
        error={auth.error}
        onRetry={() => window.location.reload()}
      />
    );
  }

  return <RouterProvider router={router} context={{ auth }} />;
};

const isMockAuth = env.VITE_MOCK_AUTH === "true";

ReactDOM.createRoot(document.querySelector("#root")!).render(
  <React.StrictMode>
    <GlobalErrorBoundary>
      {isMockAuth ? (
        <MockAuthProvider>
          <App />
        </MockAuthProvider>
      ) : (
        <AuthProvider {...oidcConfig} onSigninCallback={onSigninCallback}>
          <App />
        </AuthProvider>
      )}
    </GlobalErrorBoundary>
  </React.StrictMode>,
);
