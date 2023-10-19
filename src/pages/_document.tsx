import { ReactElement } from 'react';
import Document, {
  DocumentContext,
  DocumentInitialProps,
  Head,
  Html,
  Main,
  NextScript,
} from 'next/document';
import { ServerStyleSheet } from 'styled-components';

import i18nextConfig from '../../next-i18next.config';

export default class AppDocument extends Document {
  static async getInitialProps(
    context: DocumentContext,
  ): Promise<DocumentInitialProps> {
    const sheet = new ServerStyleSheet();
    const originalRenderPage = context.renderPage;
    try {
      context.renderPage = ():
        | DocumentInitialProps
        | Promise<DocumentInitialProps> =>
        originalRenderPage({
          enhanceApp: (App) => (properties) =>
            sheet.collectStyles(<App {...properties} />),
        });

      const initialProperties = await Document.getInitialProps(context);
      return {
        ...initialProperties,
        styles: [
          <>
            {initialProperties.styles}
            {sheet.getStyleElement()}
          </>,
        ],
      };
    } finally {
      sheet.seal();
    }
  }

  render = (): ReactElement => {
    const currentLocale =
      this.props.__NEXT_DATA__.locale ?? i18nextConfig.i18n.defaultLocale;

    return (
      <Html lang={currentLocale}>
        <Head>
          <meta name="application-name" content="LiteFront App" />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta
            name="apple-mobile-web-app-status-bar-style"
            content="default"
          />
          <meta name="apple-mobile-web-app-title" content="LiteFront App" />
          <meta name="description" content="Best LiteFront App in the world" />
          <meta name="format-detection" content="telephone=no" />
          <meta name="mobile-web-app-capable" content="yes" />
          <meta
            name="msapplication-config"
            content="/icons/browserconfig.xml"
          />
          <meta name="msapplication-TileColor" content="#2B5797" />
          <meta name="msapplication-tap-highlight" content="no" />
          <meta name="theme-color" content="#000000" />

          <link rel="apple-touch-icon" href="/assets/logo.png" />
          <link
            rel="apple-touch-icon"
            sizes="152x152"
            href="/assets/logo.png"
          />
          <link
            rel="apple-touch-icon"
            sizes="180x180"
            href="/assets/logo.png"
          />
          <link
            rel="apple-touch-icon"
            sizes="167x167"
            href="/assets/logo.png"
          />

          <link rel="icon" type="image/png" sizes="32x32" href="/favicon.ico" />
          <link rel="icon" type="image/png" sizes="16x16" href="/favicon.ico" />
          <link rel="manifest" href="/manifest.json" />
          <link rel="mask-icon" href="/assets/logo.png" color="#5bbad5" />
          <link rel="shortcut icon" href="/favicon.ico" />
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css?family=Roboto:300,400,500"
          />

          <meta name="twitter:card" content="summary" />
          <meta name="twitter:url" content="https://uxna.me" />
          <meta name="twitter:title" content="LiteFront App" />
          <meta
            name="twitter:description"
            content="Best LiteFront App in the world"
          />
          <meta
            name="twitter:image"
            content="https://yourdomain.com/icons/android-chrome-192x192.png"
          />
          <meta name="twitter:creator" content="@DavidWShadow" />
          <meta property="og:type" content="website" />
          <meta property="og:title" content="PWA App" />
          <meta property="og:description" content="Best PWA App in the world" />
          <meta property="og:site_name" content="PWA App" />
          <meta property="og:url" content="https://yourdomain.com" />
          <meta
            property="og:image"
            content="https://yourdomain.com/icons/apple-touch-icon.png"
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  };
}
