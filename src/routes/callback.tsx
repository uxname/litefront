import { captureMessage } from "@shared/lib/sentry";
import { createFileRoute } from "@tanstack/react-router";
import { FC, useEffect } from "react";

interface CallbackSearch {
  code?: string;
  state?: string;
  iss?: string;
}

const CallbackComponent: FC = () => {
  useEffect(() => {
    captureMessage("Auth callback received", { level: "info" });
  }, []);

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Authenticating...</h2>
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    </div>
  );
};

export const Route = createFileRoute("/callback")({
  validateSearch: (search: Record<string, unknown>): CallbackSearch => ({
    code: typeof search.code === "string" ? search.code : undefined,
    state: typeof search.state === "string" ? search.state : undefined,
    iss: typeof search.iss === "string" ? search.iss : undefined,
  }),
  component: CallbackComponent,
});
