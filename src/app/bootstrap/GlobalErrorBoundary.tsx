import { captureException } from "@shared/lib/sentry";
import { ErrorFallback } from "@shared/ui/ErrorFallback";
import { type ReactNode, useEffect } from "react";
import { ErrorBoundary } from "react-error-boundary";

export const GlobalErrorBoundary = ({ children }: { children: ReactNode }) => {
  useEffect(() => {
    const handleRejection = (event: PromiseRejectionEvent) => {
      captureException(event.reason);
    };

    const handleError = (event: ErrorEvent) => {
      captureException(event.error || event.message);
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
