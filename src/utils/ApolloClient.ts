import {ApolloClient, InMemoryCache} from '@apollo/client';

export const getApolloClient = new ApolloClient({
    uri: process.env.NEXT_PUBLIC_GRAPHQL_API_URL,
    cache: new InMemoryCache()
});
