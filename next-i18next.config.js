// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable unicorn/prefer-module,@typescript-eslint/no-var-requires */
const httpBackend = require('i18next-http-backend').default;
const localstorageBackend = require('i18next-localstorage-backend').default;

const isBrowser = typeof window !== 'undefined';

module.exports = {
  // debug: true,
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'ru'],
  },
  backend: {
    backends: isBrowser ? [localstorageBackend, httpBackend] : [],
    backendOptions: [
      {
        expirationTime: 7 * 24 * 60 * 60 * 1000, // 7 days
        prefix: 'i18next_res_',
        versions: {
          en: 'v1.0.0',
          ru: 'v1.0.0',
        },
        store: isBrowser ? window.localStorage : undefined,
      },
      {
        loadPath: '/locales/{{lng}}/{{ns}}.json',
        addPath: '/locales/{{lng}}/{{ns}}.missing.json',
        allowMultiLoading: false,
        parse: (data) => data,
        stringify: (data) => data,
      },
    ],
  },
  serializeConfig: false,
  use: isBrowser ? [httpBackend] : [],
};
