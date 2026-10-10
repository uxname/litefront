import * as Sentry from "@sentry/react";
import { env } from "@shared/config";
import { scrubEvent } from "./scrub";
import { sentryTags } from "./tags";

export const initSentry = () => {
  if (!env.VITE_SENTRY_DSN) {
    if (env.DEV) {
      console.warn("Sentry DSN not configured");
    }
    return;
  }

  // Errors only. Traces belong to OpenObserve and session replay to Rybbit
  // (meta ADR-0009), and GlitchTip — the error tracker this DSN points at —
  // cannot ingest replays at all.
  Sentry.init({
    dsn: env.VITE_SENTRY_DSN,
    ...sentryTags(env),

    // Query strings and fragments (OIDC code/state, tokens) never leave.
    beforeSend: scrubEvent,
  });
};

export const captureException = Sentry.captureException;
export const captureMessage = Sentry.captureMessage;
export const setUser = Sentry.setUser;
