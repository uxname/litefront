import { afterEach, expect, it, vi } from "vitest";

// The global the SSR <head> hands the payload to the browser through. Spelled
// out rather than imported: a test that reads the name from the module under
// test cannot notice the name changing.
const RUNTIME_CONFIG_GLOBAL = "__LITEFRONT_RUNTIME_CONFIG__";

// THE contract this file guards: the exact set of values that ship to every
// visitor's browser. Written out here on purpose — NOT derived from
// `src/shared/config/env.ts`, and not from a fixture this test also feeds in.
// A list derived from either tracks whatever the implementation does and guards
// nothing: adding a key would update both sides at once and stay green.
//
// Adding a key to `runtimeShape` therefore turns this test red, and the only way
// back to green is editing this list — that edit is the review step. Make it
// only for a value that every visitor of the site may read, today and forever;
// tomorrow's secret does not yet have a name a targeted assertion could match.
const PUBLISHED_KEYS = [
  "VITE_APP_VERSION",
  "VITE_BASE_URL",
  "VITE_GRAPHQL_API_URL",
  "VITE_OIDC_API_RESOURCE",
  "VITE_OIDC_AUTHORITY",
  "VITE_OIDC_CLIENT_ID",
  "VITE_OIDC_REDIRECT_URI",
  "VITE_OIDC_SCOPE",
  "VITE_SENTRY_DSN",
];

// Placeholder values: the schema only asks the required keys to be non-empty
// strings. Building the injected source from the SAME list is what makes a newly
// added *required* key fail loudly (the module refuses to load, naming it)
// instead of being quietly satisfied by a fixture someone extended.
const injectedConfig = Object.fromEntries(
  PUBLISHED_KEYS.map((key) => [key, `value-of-${key}`]),
);

// The module builds its payload while being imported, so it needs a fresh
// registry with the global already in place.
const loadScript = async (): Promise<string> => {
  vi.resetModules();
  vi.stubGlobal(RUNTIME_CONFIG_GLOBAL, injectedConfig);
  const { runtimeConfigScript } = await import("@shared/config");
  return runtimeConfigScript;
};

afterEach(() => {
  vi.unstubAllGlobals();
});

it("C3: ships exactly the listed keys to the browser, no more", async () => {
  // Parsed back out of the inline <script> body — the literal bytes the page
  // serves — rather than out of an internal object, so a key added anywhere on
  // the way to the browser is caught, not only one added to the key list.
  const payload: Record<string, string> = JSON.parse(
    (await loadScript())
      .replace(`window.${RUNTIME_CONFIG_GLOBAL}=`, "")
      .slice(0, -1),
  );

  // Sorted on both sides: the guard is about composition, and a reordering of
  // the source literal is not a leak.
  expect(Object.keys(payload).sort()).toEqual([...PUBLISHED_KEYS].sort());
});
