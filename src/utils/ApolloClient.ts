import { ApolloClient, InMemoryCache } from '@apollo/client';
import { BatchHttpLink } from '@apollo/client/link/batch-http';
import { LocalStorageWrapper, persistCache } from 'apollo3-cache-persist';

const cache = new InMemoryCache();

if (
  process.env.NEXT_PUBLIC_PERSIST_CACHE === 'true' &&
  typeof window !== 'undefined'
) {
  persistCache({
    cache,
    storage: new LocalStorageWrapper(window.localStorage),
  }).then(() => {
    // Continue setting up Apollo Client as usual.
  });
}

export const getApolloClient = new ApolloClient({
  link:
    process.env.NEXT_PUBLIC_MERGED_GRAPHQL_REQUESTS_ENABLED === 'true' &&
    typeof window !== 'undefined'
      ? new BatchHttpLink({
          uri: process.env.NEXT_PUBLIC_GRAPHQL_API_URL,
          batchMax: parseInt(
            process.env.NEXT_PUBLIC_MERGED_GRAPHQL_REQUESTS_BATCH_MAX || '7',
          ), // No more than 7 operations per batch
          batchInterval: parseInt(
            process.env.NEXT_PUBLIC_MERGED_GRAPHQL_REQUESTS_BATCH_INTERVAL ||
              '20',
          ), // Wait no more than 20ms after first batched operation
        })
      : undefined,
  uri:
    process.env.NEXT_PUBLIC_MERGED_GRAPHQL_REQUESTS_ENABLED === 'true' &&
    typeof window !== 'undefined'
      ? undefined
      : process.env.NEXT_PUBLIC_GRAPHQL_API_URL,
  cache,
  connectToDevTools: process.env.NEXT_PUBLIC_DEBUG === 'true',
});
