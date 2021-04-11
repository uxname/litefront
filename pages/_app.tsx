import {getApolloClient} from '../utils/ApolloClient';
import {ApolloProvider} from '@apollo/client';
import React, {ReactNode} from 'react';
import {AppProps} from 'next/app';

export default function MyApp({Component, pageProps}: AppProps): ReactNode {
    return <ApolloProvider client={getApolloClient}>
        <Component {...pageProps} />
    </ApolloProvider>;
}
