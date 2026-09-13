import * as Sentry from "@sentry/react";
import { env } from "@shared/config";

export const initSentry = () => {
  if (!env.VITE_SENTRY_DSN) {
    if (env.DEV) {
      console.warn("Sentry DSN not configured");
    }
    return;
  }

  Sentry.init({
    dsn: env.VITE_SENTRY_DSN,
    environment: env.MODE,
    release: env.VITE_APP_VERSION || "development",

    integrations: [Sentry.browserTracingIntegration()],

    tracesSampleRate: env.PROD ? 0.1 : 1.0,
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,

    beforeSend: (event) => {
      if (event.exception) {
        event.exception.values?.forEach((value) => {
          if (value.stacktrace) {
            value.stacktrace.frames?.forEach((frame) => {
              if (frame.filename) {
                frame.filename = frame.filename.split("?")[0];
              }
            });
          }
        });
      }
      return event;
    },
  });

  // Session Replay loads in its own chunk (see ./replay), so the first screen
  // never pays for it. The sample rates above are already in effect, so a
  // sampled session starts recording as soon as the chunk lands — no reload. If
  // the chunk cannot be fetched at all, the app carries on without replays.
  void import("./replay")
    .then(({ addReplayIntegration }) => {
      addReplayIntegration();
    })
    .catch(() => {
      // A missing replay recorder must never take the app down with it.
    });
};

export const captureException = Sentry.captureException;
export const captureMessage = Sentry.captureMessage;
export const setUser = Sentry.setUser;
export const withScope = Sentry.withScope;
