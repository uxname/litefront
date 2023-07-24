// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable unicorn/prefer-module,@typescript-eslint/no-var-requires */

/** @type {import('next-i18next').UserConfig} */
const i18n = {
  debug: process.env.NODE_ENV === 'development',
  i18n: {
    defaultLocale: 'default',
    locales: ['default', 'en', 'ru'],
  },
  reloadOnPrerender: process.env.NODE_ENV === 'development',
  loadPath: '/locales/{{lng}}/{{ns}}.json',
  addPath: '/locales/{{lng}}/{{ns}}.missing.json',
  serializeConfig: false,
  saveMissing: false,
};

module.exports = i18n;
