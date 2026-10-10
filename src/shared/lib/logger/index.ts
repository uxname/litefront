import { captureException } from "@shared/lib/sentry";

interface LogContext {
  tags?: Record<string, string>;
  extra?: Record<string, unknown>;
}

/**
 * The single error sink for browser code.
 *
 * Error tracking is opt-in: the DSN is read when the server boots, and without
 * one `captureException` is a no-op. An app running without a DSN would
 * therefore swallow every crash without a trace. The console line is what keeps a failure
 * visible regardless — in devtools, in the e2e log harness
 * (`npm run test:e2e:logs`), and in the SSR container log. Sentry is the extra
 * copy, not the only one.
 *
 * `msg` is a short stable slug (`graphql_error`, `react_error_boundary`, …) so
 * the log can be grepped by event, the way the backend's `msg` field is.
 */
export const logError = (
  msg: string,
  error: unknown,
  context?: LogContext,
): void => {
  console.error(msg, context?.extra ?? {}, error);
  captureException(error, context);
};
