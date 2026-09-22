import type { Event } from "@sentry/react";

// Query strings and fragments never leave for Sentry. The OIDC redirect lands
// on /callback?code=…&state=…, and the SDK copies the page URL into the
// request, every navigation/fetch breadcrumb and the transaction; other URLs
// can carry tokens or ids too. The path is all a report needs.
//
// Pure (no SDK import at runtime), so the browser and Node configs share it.

/** `url` without its query string and fragment. */
export const scrubUrl = (url: string): string => url.split(/[?#]/, 1)[0];

const scrubData = (data: Record<string, unknown> | undefined) => {
  if (!data) return;
  for (const key of ["url", "from", "to", "http.url"]) {
    const value = data[key];
    if (typeof value === "string") data[key] = scrubUrl(value);
  }
};

/** Removes query strings and fragments from every URL an event carries. */
export const scrubEvent = <T extends Event>(event: T): T => {
  if (event.request) {
    if (event.request.url) event.request.url = scrubUrl(event.request.url);
    delete event.request.query_string;
  }
  if (event.transaction) event.transaction = scrubUrl(event.transaction);
  for (const crumb of event.breadcrumbs ?? []) scrubData(crumb.data);
  for (const span of event.spans ?? []) {
    scrubData(span.data as Record<string, unknown> | undefined);
  }
  for (const value of event.exception?.values ?? []) {
    for (const frame of value.stacktrace?.frames ?? []) {
      if (frame.filename) frame.filename = scrubUrl(frame.filename);
    }
  }
  return event;
};
