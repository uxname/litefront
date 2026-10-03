import type { FC } from "react";
import { Spinner } from "./spinner";

/** Full-viewport pending indicator: the router's global loading boundary. */
export const PageLoader: FC<{ label?: string }> = ({ label }) => (
  <div className="flex min-h-screen w-full flex-col items-center justify-center gap-3 bg-muted">
    <Spinner className="size-8 text-muted-foreground" aria-label={label} />
    {label && (
      <p className="text-sm text-muted-foreground" aria-hidden="true">
        {label}
      </p>
    )}
  </div>
);
