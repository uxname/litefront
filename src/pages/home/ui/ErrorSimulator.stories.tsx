import { Button } from "@shared/ui/button";
import type { Meta, StoryFn } from "@storybook/react-vite";
import { ErrorBoundary } from "react-error-boundary";
import { ErrorSimulator } from "./ErrorSimulator";

export default { component: ErrorSimulator } satisfies Meta<
  typeof ErrorSimulator
>;

// ErrorSimulator relies on `useErrorBoundary`, so it must be rendered inside an
// ErrorBoundary. Pressing the crash button swaps the card for this fallback.
export const Default: StoryFn = () => (
  <ErrorBoundary
    fallbackRender={({ error, resetErrorBoundary }) => (
      <div className="rounded-xl border border-destructive bg-card p-8 text-center">
        <p className="mb-4 font-bold text-destructive">
          {error instanceof Error ? error.message : String(error)}
        </p>
        <Button variant="secondary" onClick={resetErrorBoundary}>
          Reset
        </Button>
      </div>
    )}
  >
    <div className="max-w-sm">
      <ErrorSimulator />
    </div>
  </ErrorBoundary>
);
