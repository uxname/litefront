import type { Story } from "@ladle/react";
import { ErrorBoundary } from "react-error-boundary";
import { ErrorSimulator } from "./ErrorSimulator";

// ErrorSimulator relies on `useErrorBoundary`, so it must be rendered inside an
// ErrorBoundary. Pressing the crash button swaps the card for this fallback.
export const Default: Story = () => (
  <ErrorBoundary
    fallbackRender={({ error, resetErrorBoundary }) => (
      <div className="bg-base-100 rounded-2xl border border-error p-8 text-center">
        <p className="text-error font-bold mb-4">
          {error instanceof Error ? error.message : String(error)}
        </p>
        <button
          type="button"
          onClick={resetErrorBoundary}
          className="px-4 py-2 rounded-xl bg-base-200 text-base-content font-semibold"
        >
          Reset
        </button>
      </div>
    )}
  >
    <div className="max-w-sm">
      <ErrorSimulator />
    </div>
  </ErrorBoundary>
);
