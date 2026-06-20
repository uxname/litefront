import { Loader2 } from "lucide-react";
import { FC } from "react";

/** Full-viewport pending indicator used as the router's global loading boundary. */
export const PageLoader: FC = () => (
  <div className="flex min-h-screen w-full items-center justify-center bg-base-200">
    <Loader2 className="h-8 w-8 animate-spin text-base-content/70" />
  </div>
);
