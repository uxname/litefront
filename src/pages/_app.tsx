import React, { ReactNode, useEffect } from 'react';
import { AppProps } from 'next/app';
import Script from 'next/script';
import { appWithTranslation } from 'next-i18next';
import { ApolloProvider } from '@apollo/client';
import { StyledEngineProvider } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider as StyledComponentProvider } from 'styled-components';

import { getApolloClient } from '@/services/apollo-client.service';
import { log } from '@/services/log';
import { useSettingsStore } from '@/store/settings.store';
import { themeMui, themeStyled } from '@/theme';

import nextI18NextConfig from '../../next-i18next.config';

import { ThemeProvider as MaterialUiProvider } from '@mui/material/styles';

function MyApp({ Component, pageProps }: AppProps): ReactNode {
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      log.error('Unhandled error', event.error);
    };

    const handlePromiseRejection = (event: PromiseRejectionEvent) => {
      log.error('Unhandled promise rejection', event.reason);
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handlePromiseRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handlePromiseRejection);
    };
  }, []);

  const { debugMode } = useSettingsStore();

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
      {debugMode && (
        <Script
          src="https://unpkg.com/vconsole@latest/dist/vconsole.min.js"
          onLoad={() => {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            // eslint-disable-next-line no-new
            new window.VConsole();
          }}
        />
      )}
    </StyledComponentProvider>
  );
}

export default appWithTranslation(MyApp, nextI18NextConfig);
