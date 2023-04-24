import React, { ReactNode } from 'react';
import { AppProps } from 'next/app';
import { ApolloProvider } from '@apollo/client';
import { StyledEngineProvider } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider as StyledComponentProvider } from 'styled-components';

import { themeMui, themeStyled } from '@/theme';
import { getApolloClient } from '@/utils/apollo-client';

import { ThemeProvider as MaterialUiProvider } from '@mui/material/styles';

export default function MyApp({ Component, pageProps }: AppProps): ReactNode {
  return (
    <StyledComponentProvider theme={themeStyled}>
      <MaterialUiProvider theme={themeMui}>
        <CssBaseline />
        <StyledEngineProvider injectFirst>
          <ApolloProvider client={getApolloClient}>
            <Component {...pageProps} />
          </ApolloProvider>
        </StyledEngineProvider>
      </MaterialUiProvider>
    </StyledComponentProvider>
  );
}
