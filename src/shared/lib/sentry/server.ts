import * as Sentry from "@sentry/node";
import { env } from "@shared/config";

// Server-side counterpart of ./config.ts: that one initialises the browser SDK
// from src/client.tsx, so it never runs during SSR and a failed render went
// unreported. Node needs its own client, initialised here at import time — which
// happens exactly once per process because src/server.ts is the single SSR entry.
// Deliberately NOT re-exported from ./index.ts: @sentry/node must stay out of the
// client bundle.
const isEnabled = Boolean(env.VITE_SENTRY_DSN);

if (isEnabled) {
  Sentry.init({
    dsn: env.VITE_SENTRY_DSN,
    environment: env.MODE,
    release: env.VITE_APP_VERSION || "development",
  });
}

// The 500 goes out right after the capture, so give the event a moment to leave
// the process — but never hold the response hostage to Sentry being reachable.
const FLUSH_TIMEOUT_MS = 2000;

/** Report an SSR failure. A no-op (not an error) when no DSN is configured. */
export const captureServerException = async (error: unknown) => {
  if (!isEnabled) {
    return;
  }
  Sentry.captureException(error);
  await Sentry.flush(FLUSH_TIMEOUT_MS);
};
