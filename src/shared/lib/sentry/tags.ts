// The environment and release every report is filed under, shared by the
// browser (./config.ts) and Node (./server.ts) clients so the two never tag
// one deployment differently.
//
// The environment comes from VITE_APP_ENV, read when the server boots — not
// from MODE, which is fixed at build time and so reads "production" in every
// image, staging included. MODE is only the fallback for an unset value.

type TagSource = {
  VITE_APP_ENV: string;
  VITE_APP_VERSION: string;
  MODE: string;
};

export const sentryTags = (source: TagSource) => ({
  environment: source.VITE_APP_ENV || source.MODE,
  release: source.VITE_APP_VERSION || "development",
});
