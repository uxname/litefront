/* eslint-disable @typescript-eslint/no-var-requires */
const withPlugins = require('next-compose-plugins');
const {withSentryConfig} = require('@sentry/nextjs');

const sentryWebpackPluginOptions = {
    // Additional config options for the Sentry Webpack plugin. Keep in mind that
    // the following options are set automatically, and overriding them is not
    // recommended:
    //   release, url, org, project, authToken, configFile, stripPrefix,
    //   urlPrefix, include, ignore
    // For all available options, see:
    // https://github.com/getsentry/sentry-webpack-plugin#options.
    authToken: process.env.SENTRY_AUTH_TOKEN,
    validate: true
};

module.exports = withPlugins([
    nextConfig => process.env.SENTRY_ENABLED === 'true' ? withSentryConfig(nextConfig, sentryWebpackPluginOptions) : nextConfig
], {
    poweredByHeader: false,
    distDir: 'build',
    productionBrowserSourceMaps: true
});
