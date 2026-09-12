import { CallbackHandler } from "@features/auth";
import { createFileRoute } from "@tanstack/react-router";

interface CallbackSearch {
  code?: string;
  state?: string;
  iss?: string;
}

export const Route = createFileRoute("/callback")({
  // OIDC redirect handling is browser-only; don't render on the server.
  ssr: false,
  validateSearch: (search: Record<string, unknown>): CallbackSearch => ({
    code: typeof search.code === "string" ? search.code : undefined,
    state: typeof search.state === "string" ? search.state : undefined,
    iss: typeof search.iss === "string" ? search.iss : undefined,
  }),
  component: CallbackHandler,
});
