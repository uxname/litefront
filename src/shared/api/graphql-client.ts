import { env } from "@shared/config";
import { captureException } from "@shared/lib/sentry";
import { cacheExchange } from "@urql/exchange-graphcache";
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
