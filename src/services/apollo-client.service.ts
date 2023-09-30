import { useEffect, useState } from 'react';
import {
  ApolloCache,
  ApolloClient,
  InMemoryCache,
  NormalizedCacheObject,
} from '@apollo/client';
import { BatchHttpLink } from '@apollo/client/link/batch-http';
import { LocalStorageWrapper, persistCache } from 'apollo3-cache-persist';

import { useAuthStore } from '@/store/auth.store';

type ApolloClientType = ApolloClient<NormalizedCacheObject>;
interface ApolloClientParameters {
  cache?: ApolloCache<NormalizedCacheObject>;
  authorizationHeader?: string;
}

export function getApolloClient({
  cache,
  authorizationHeader,
}: ApolloClientParameters): ApolloClientType {
  return new ApolloClient({
    link:
      process.env.NEXT_PUBLIC_MERGED_GRAPHQL_REQUESTS_ENABLED === 'true' &&
      typeof window !== 'undefined'
        ? new BatchHttpLink({
            uri: process.env.NEXT_PUBLIC_GRAPHQL_API_URL,
            batchMax: Number.parseInt(
              process.env.NEXT_PUBLIC_MERGED_GRAPHQL_REQUESTS_BATCH_MAX || '7',
            ), // No more than 7 operations per batch
            batchInterval: Number.parseInt(
              process.env.NEXT_PUBLIC_MERGED_GRAPHQL_REQUESTS_BATCH_INTERVAL ||
                '20',
            ), // Wait no more than 20ms after first batched operation
          })
        : undefined,
    ...(authorizationHeader && {
      headers: {
        authorization: authorizationHeader,
      },
    }),
    uri:
      process.env.NEXT_PUBLIC_MERGED_GRAPHQL_REQUESTS_ENABLED === 'true' &&
      typeof window !== 'undefined'
        ? undefined
        : process.env.NEXT_PUBLIC_GRAPHQL_API_URL,
    cache: cache || new InMemoryCache(),
    connectToDevTools: process.env.NEXT_PUBLIC_DEBUG === 'true',
    defaultOptions: {
      query: {
        fetchPolicy: 'cache-first',
      },
      watchQuery: {
        fetchPolicy: 'cache-and-network',
      },
      mutate: {
        fetchPolicy: 'network-only',
      },
    },
  });
}

export function useApolloClient(): ApolloClientType {
  const authStore = useAuthStore();
  const [client, setClient] = useState(
    getApolloClient({
      authorizationHeader: authStore.token,
    }),
  );
  useEffect(() => {
    (async (): Promise<void> => {
      if (process.env.NEXT_PUBLIC_PERSIST_CACHE === 'true') {
        await persistCache({
          cache: client.cache,
          storage: new LocalStorageWrapper(window.localStorage),
        });
      }

      setClient(
        getApolloClient({
          cache: client.cache,
          authorizationHeader: authStore.token,
        }),
      );
    })();
  }, []);
  return client;
}
