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

    integrations: [
      Sentry.browserTracingIntegration(),
      // Mask all text and block media in session replays so PII and secrets
      // visible in the DOM (emails, tokens, profile data) are never recorded.
      Sentry.replayIntegration({
        maskAllText: true,
        blockAllMedia: true,
      }),
    ],

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
};

export const captureException = Sentry.captureException;
export const captureMessage = Sentry.captureMessage;
export const setUser = Sentry.setUser;
export const withScope = Sentry.withScope;
