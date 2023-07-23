import React, { ReactNode } from 'react';
import { AppProps } from 'next/app';
import { appWithTranslation } from 'next-i18next';
import { ApolloProvider } from '@apollo/client';
import { StyledEngineProvider } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider as StyledComponentProvider } from 'styled-components';

import { getApolloClient } from '@/services/apollo-client.service';
import { themeMui, themeStyled } from '@/theme';

import nextI18NextConfig from '../../next-i18next.config';

import { ThemeProvider as MaterialUiProvider } from '@mui/material/styles';

function MyApp({ Component, pageProps }: AppProps): ReactNode {
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

export default appWithTranslation(MyApp, nextI18NextConfig);
