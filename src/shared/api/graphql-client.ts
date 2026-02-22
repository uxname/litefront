import { captureException } from "@shared/lib/sentry";
import { Client, cacheExchange, errorExchange, fetchExchange } from "urql";

export const createGraphQLClient = (accessToken?: string): Client => {
  return new Client({
    url: import.meta.env.VITE_GRAPHQL_API_URL,
    exchanges: [
      cacheExchange,
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
    },
    requestPolicy: "cache-and-network",
  });
};

export { Provider as GraphQLProvider } from "urql";
