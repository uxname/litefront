import { Client, cacheExchange, fetchExchange } from "urql";

export const createGraphQLClient = (accessToken?: string): Client => {
  return new Client({
    url: import.meta.env.VITE_GRAPHQL_API_URL,
    exchanges: [cacheExchange, fetchExchange],
    fetchOptions: {
      headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
    },
    requestPolicy: "cache-and-network",
  });
};

export { Provider as GraphQLProvider } from "urql";
