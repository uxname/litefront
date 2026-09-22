import { describe, expect, it } from "vitest";
import { buildCsp, newCspNonce } from "./csp";

const origins = {
  VITE_GRAPHQL_API_URL: "https://api.example.com/graphql",
  VITE_OIDC_AUTHORITY: "https://auth.example.com/oidc",
  VITE_SENTRY_DSN: "https://key@o123.ingest.sentry.io/456",
};

// Parses "a b; c d" into { a: ["b"], c: ["d"] } so a test can ask for one
// directive without depending on the order the policy lists them in.
const directives = (policy: string): Record<string, string[]> =>
  Object.fromEntries(
    policy
      .split(";")
      .map((d) => d.trim().split(/\s+/))
      .filter(([name]) => name)
      .map(([name, ...values]) => [name, values]),
  );

describe("buildCsp", () => {
  it("runs scripts only from self and the request's nonce — never inline", () => {
    const csp = directives(buildCsp("n0nce", origins));
    expect(csp["script-src"]).toEqual(["'self'", "'nonce-n0nce'"]);
    expect(csp["script-src"]).not.toContain("'unsafe-inline'");
    expect(csp["object-src"]).toEqual(["'none'"]);
    expect(csp["base-uri"]).toEqual(["'self'"]);
  });

  it("lets the browser talk to exactly the configured API, IdP and Sentry origins", () => {
    const csp = directives(buildCsp("n", origins));
    expect(csp["connect-src"]).toEqual([
      "'self'",
      "https://api.example.com",
      "https://auth.example.com",
      "https://o123.ingest.sentry.io",
    ]);
    // Silent renew loads the IdP in an iframe; sign-in posts to it.
    expect(csp["frame-src"]).toEqual(["https://auth.example.com"]);
    expect(csp["form-action"]).toEqual(["'self'", "https://auth.example.com"]);
  });

  it("drops Sentry when no DSN is configured", () => {
    const csp = directives(buildCsp("n", { ...origins, VITE_SENTRY_DSN: "" }));
    expect(csp["connect-src"]).not.toContain("https://o123.ingest.sentry.io");
  });

  // /callback runs in a same-origin iframe for silent renew, so framing by the
  // app itself is allowed — by nobody else.
  it("allows same-origin framing only", () => {
    expect(directives(buildCsp("n", origins))["frame-ancestors"]).toEqual([
      "'self'",
    ]);
  });

  // Avatars come from object storage or the IdP's picture claim, any host.
  it("allows images from any host but never code-bearing schemes", () => {
    expect(directives(buildCsp("n", origins))["img-src"]).toEqual([
      "'self'",
      "https:",
      "http:",
      "data:",
      "blob:",
    ]);
  });
});

describe("newCspNonce", () => {
  it("is fresh on every call and safe to put in a header", () => {
    const a = newCspNonce();
    expect(a).toMatch(/^[A-Za-z0-9+/]{22}==$/);
    expect(newCspNonce()).not.toBe(a);
  });
});
