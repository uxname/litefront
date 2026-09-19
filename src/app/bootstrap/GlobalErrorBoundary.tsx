import { logError } from "@shared/lib/logger";
import { ErrorFallback } from "@shared/ui/ErrorFallback";
import type { ReactNode } from "react";
import { ErrorBoundary } from "react-error-boundary";

export const GlobalErrorBoundary = ({ children }: { children: ReactNode }) => {
  // No window-level `error` / `unhandledrejection` listeners here, on purpose:
  // the browser prints both to the console by itself, Sentry's default
  // GlobalHandlers integration captures both when a DSN is set, and the e2e log
  // harness records them as `pageerror`. A listener of ours only said it twice.
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
