import { env } from "@shared/config";
import { captureException } from "@shared/lib/sentry";
import { cacheExchange } from "@urql/exchange-graphcache";
import { retryExchange } from "@urql/exchange-retry";
import { Client, errorExchange, fetchExchange } from "urql";

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
              graphQLErrors: error.graphQLErrors,
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
        maxDelayMs: 15000,
        randomDelay: true,
        maxNumberAttempts: 3,
        // Retry only network-level failures; GraphQL/business errors are not retried.
        retryIf: (error) => Boolean(error?.networkError),
      }),
      fetchExchange,
    ],
    fetchOptions: {
      headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
      signal: AbortSignal.timeout(15000),
    },
    requestPolicy: "cache-and-network",
  });
};

export { Provider as GraphQLProvider } from "urql";
