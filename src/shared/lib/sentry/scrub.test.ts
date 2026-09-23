import type { Event } from "@sentry/react";
import { describe, expect, it } from "vitest";
import { scrubEvent, scrubUrl } from "./scrub";

const callback = "https://app.example/callback?code=SECRET&state=STATE#frag";

describe("scrubUrl", () => {
  it("drops the query and the fragment", () => {
    expect(scrubUrl(callback)).toBe("https://app.example/callback");
    expect(scrubUrl("/callback?code=SECRET")).toBe("/callback");
    expect(scrubUrl("https://app.example/account")).toBe(
      "https://app.example/account",
    );
  });
});

// The OIDC redirect lands on /callback?code=…&state=…, and the SDK copies the
// page URL into the request, every breadcrumb and the navigation transaction.
// None of it may reach the third-party store.
describe("scrubEvent", () => {
  it("strips auth parameters from every place a URL rides along", () => {
    const event: Event = {
      request: { url: callback, query_string: "code=SECRET&state=STATE" },
      transaction: "/callback?code=SECRET",
      breadcrumbs: [
        { category: "navigation", data: { from: callback, to: callback } },
        { category: "fetch", data: { url: `${callback}&x=1` } },
      ],
      spans: [
        {
          span_id: "1",
          trace_id: "t",
          start_timestamp: 0,
          data: {
            "http.url": callback,
            url: callback,
            // urql sends queries as GET, so the query string is the variables.
            "http.query": "?query=q&variables=SECRET",
          },
        },
      ],
      exception: {
        values: [
          {
            stacktrace: {
              frames: [{ filename: "https://app.example/a.js?v=1" }],
            },
          },
        ],
      },
    } as Event;

    const out = JSON.stringify(scrubEvent(event));

    expect(out).not.toContain("SECRET");
    expect(out).not.toContain("STATE");
    expect(out).toContain("https://app.example/callback");
    expect(out).toContain("https://app.example/a.js");
  });

  it("leaves an event without URLs alone", () => {
    const event: Event = { message: "hi" };
    expect(scrubEvent(event)).toEqual({ message: "hi" });
  });
});
