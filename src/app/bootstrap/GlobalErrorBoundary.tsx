import { logError } from "@shared/lib/logger";
import { ErrorFallback } from "@shared/ui/ErrorFallback";
import { type ReactNode, useEffect } from "react";
import { ErrorBoundary } from "react-error-boundary";

export const GlobalErrorBoundary = ({ children }: { children: ReactNode }) => {
  useEffect(() => {
    const handleRejection = (event: PromiseRejectionEvent) => {
      logError("unhandled_rejection", event.reason);
    };

    const handleError = (event: ErrorEvent) => {
      logError("uncaught_error", event.error || event.message);
    };

    window.addEventListener("unhandledrejection", handleRejection);
    window.addEventListener("error", handleError);
    return () => {
      window.removeEventListener("unhandledrejection", handleRejection);
      window.removeEventListener("error", handleError);
    };
  }, []);

  return (
    <ErrorBoundary
      // A React render error is caught here and never reaches window.onerror,
      // so without this hook it was reported nowhere at all.
      onError={(error, info) =>
        logError("react_error_boundary", error, {
          extra: { componentStack: info.componentStack },
        })
      }
      FallbackComponent={({ error, resetErrorBoundary }) => (
        <ErrorFallback
          error={error}
          reset={resetErrorBoundary}
          // Only a click handler, so it never runs during the server render.
          onRetry={() => window.location.reload()}
          // `pathname` is deliberately not passed: ErrorFallback reads it
          // SSR-safely itself. Passing `window.location.pathname` here evaluated
          // it during render, and this tree is isomorphic (`defaultSsr: true`).
        />
      )}
    >
      {children}
    </ErrorBoundary>
  );
};
