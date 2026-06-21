import { env } from "@shared/config";
import { captureException } from "@shared/lib/sentry";
import { cacheExchange } from "@urql/exchange-graphcache";
import { retryExchange } from "@urql/exchange-retry";
import { Client, errorExchange, fetchExchange } from "urql";

// Per-request abort deadline: a single request is given up after this long.
const REQUEST_TIMEOUT_MS = 15_000;
// Ceiling for the exponential retry backoff between attempts — a distinct
// concern from the per-request deadline above, so it gets its own constant.
const RETRY_MAX_DELAY_MS = 15_000;

export const createGraphQLClient = (accessToken?: string): Client => {
  return new Client({
    url: env.VITE_GRAPHQL_API_URL,
    exchanges: [
      // Normalized cache: entities are keyed by id, so a mutation returning an
      // updated Profile patches every query holding it (e.g. `me`) automatically.
      cacheExchange({
        keys: {
          Profile: (data) => (data.id != null ? String(data.id) : null),
        },
      }),
      errorExchange({
        onError: (error) => {
          captureException(error, {
            tags: { source: "graphql" },
            extra: {
              message: error.message,
              // Send only the error messages and paths — never the full
              // graphQLErrors objects, whose `extensions` can carry sensitive
              // server detail.
              graphQLErrors: error.graphQLErrors.map((e) => ({
                message: e.message,
                path: e.path,
              })),
              networkError: error.networkError
                ? error.networkError.message
                : undefined,
            },
          });
        },
      }),
      // Sits below errorExchange (closer to the network) so transient network
      // failures are retried with exponential backoff BEFORE the final error is
      // reported to Sentry — only genuinely failed requests get logged.
      retryExchange({
        initialDelayMs: 1000,
        maxDelayMs: RETRY_MAX_DELAY_MS,
        randomDelay: true,
        maxNumberAttempts: 3,
        // Retry only network-level failures; GraphQL/business errors are not retried.
        retryIf: (error) => Boolean(error?.networkError),
      }),
      fetchExchange,
    ],
    // A function (not a static object) so every request gets a *fresh* abort
    // signal. The client is memoized for the whole session (per access token),
    // so a single shared AbortSignal.timeout would fire once and then abort
    // every later request on that client.
    fetchOptions: () => {
      const headers: Record<string, string> = {};
      if (accessToken) headers.Authorization = `Bearer ${accessToken}`;
      return { headers, signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS) };
    },
    requestPolicy: "cache-and-network",
  });
};

export { Provider as GraphQLProvider } from "urql";
