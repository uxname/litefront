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
          onRetry={() => window.location.reload()}
          pathname={window.location.pathname}
        />
      )}
    >
      {children}
    </ErrorBoundary>
  );
};
