import { initSentry } from "@shared/lib/sentry";
import { StartClient } from "@tanstack/react-start/client";
import { StrictMode, startTransition } from "react";
import { hydrateRoot } from "react-dom/client";

// Client entry: runs only in the browser. Browser-only side effects (Sentry,
// react-scan) live here; the provider tree (auth + GraphQL) is injected via the
// router's `Wrap` option (see src/router.tsx), so StartClient — which owns
// RouterProvider — is all we render.
initSentry();

if (import.meta.env.DEV) {
  import("react-scan").then(({ scan }) => {
    scan({ enabled: true, log: true });
  });
}

startTransition(() => {
  hydrateRoot(
    document,
    <StrictMode>
      <StartClient />
    </StrictMode>,
  );
});
