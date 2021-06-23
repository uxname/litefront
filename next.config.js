/* eslint-disable @typescript-eslint/no-var-requires */
const withPlugins = require('next-compose-plugins');
const optimizedImages = require('next-optimized-images');

module.exports = withPlugins([
    [optimizedImages, {
        optimizeImagesInDev: true
    }]
], {
    poweredByHeader: false,
    distDir: 'build',
    webpack5: false
});
