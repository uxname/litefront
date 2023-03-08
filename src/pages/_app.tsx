import React, { ReactNode } from 'react';
import { AppProps } from 'next/app';
import NextHead from 'next/head';
import { ApolloProvider } from '@apollo/client';

import { getApolloClient } from '@/utils/apollo-client';

export default function MyApp({ Component, pageProps }: AppProps): ReactNode {
  return (
    <ApolloProvider client={getApolloClient}>
      <NextHead>
        <title>LiteFront</title>
      </NextHead>
      <Component {...pageProps} />
    </ApolloProvider>
  );
}
