import { ErrorFallback } from "@shared/ui/ErrorFallback";
import { type ReactNode, useEffect } from "react";
import { ErrorBoundary } from "react-error-boundary";

export const GlobalErrorBoundary = ({ children }: { children: ReactNode }) => {
  useEffect(() => {
    const errorHandler = (event: PromiseRejectionEvent) => {
      console.error("Uncaught Promise Rejection:", event.reason);
    };

    window.addEventListener("unhandledrejection", errorHandler);
    return () => window.removeEventListener("unhandledrejection", errorHandler);
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
