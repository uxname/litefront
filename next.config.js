// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable @typescript-eslint/no-var-requires,unicorn/prefer-module */
const { withSentryConfig } = require('@sentry/nextjs');

const sentryWebpackPluginOptions = {
  // Additional config options for the Sentry Webpack plugin. Keep in mind that
  // the following options are set automatically, and overriding them is not
  // recommended:
  //   release, url, org, project, authToken, configFile, stripPrefix,
  //   urlPrefix, include, ignore
  // For all available options, see:
  // https://github.com/getsentry/sentry-webpack-plugin#options.
  authToken: process.env.SENTRY_AUTH_TOKEN,
  validate: true,
  org: process.env.NEXT_PUBLIC_SENTRY_ORG,
  project: process.env.NEXT_PUBLIC_SENTRY_PROJECT,
};

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

// @ts-check
/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  distDir: 'build',
  productionBrowserSourceMaps: true,
};

const outNextSentryConfig =
  process.env.SENTRY_ENABLED === 'true'
    ? withSentryConfig(nextConfig, sentryWebpackPluginOptions)
    : nextConfig;

module.exports = withBundleAnalyzer(outNextSentryConfig);
