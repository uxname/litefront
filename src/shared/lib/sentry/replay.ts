import * as Sentry from "@sentry/react";
import { scrubEvent, scrubRecordingEvent } from "./scrub";

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
 *
 * Replay events and recordings skip `beforeSend`, so they get the same URL
 * scrubbing here: the OIDC `/callback?code=…&state=…` and urql's GET query
 * strings stay out of them too.
 */
export const addReplayIntegration = () => {
  Sentry.addEventProcessor((event) =>
    event.type === "replay_event" ? scrubEvent(event) : event,
  );
  Sentry.addIntegration(
    Sentry.replayIntegration({
      maskAllText: true,
      blockAllMedia: true,
      beforeAddRecordingEvent: scrubRecordingEvent,
    }),
  );
};
