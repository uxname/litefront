import * as Sentry from "@sentry/react";

/**
 * Session Replay, kept out of the entry bundle.
 *
 * This module is only ever reached through a dynamic `import()`, so the bundler
 * puts the replay recorder (rrweb, ~50 kB gzipped) in a chunk of its own that
 * the first screen never downloads. Recording starts the moment the chunk lands
 * — no page reload, and a sampled session is still captured from its start.
 *
 * Masking mirrors what `initSentry` used to pass inline: all text is masked and
 * media blocked, so PII and secrets visible in the DOM (emails, tokens, profile
 * data) are never recorded.
 */
export const addReplayIntegration = () => {
  Sentry.addIntegration(
    Sentry.replayIntegration({
      maskAllText: true,
      blockAllMedia: true,
    }),
  );
};
