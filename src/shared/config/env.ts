import { z } from "zod";

// Name of the global the SSR HTML hands the runtime values to the browser
// through (see `runtimeConfigScript`).
const RUNTIME_CONFIG_GLOBAL = "__LITEFRONT_RUNTIME_CONFIG__";

// Required vars: a missing OIDC/API value silently breaks authentication and
// every network call, so they must be present and non-empty. Messages are
// name-free on purpose — the variable's name is prefixed from `issue.path`
// below, which puts it in the log for EVERY failure kind. Spelling it in the
// message instead misses the most likely one: an unset variable arrives as
// `undefined` and zod reports its own "expected string, received undefined".
const requiredString = z
  .string({ error: "is required" })
  .min(1, { error: "is required" });

// Optional vars default to "" (not undefined) so consumers keep a plain string
// type and never have to guard against undefined.
const optionalString = z.string().default("");

// THE list of values that reach the browser, and the only one: the payload
// below is built by picking these keys, never by copying an object or walking
// `process.env`. Adding a key here publishes it — never put a secret in it.
//
// These are RUNTIME values: read from the container's environment when the
// server boots, not inlined by Vite at build time, so one built image runs in
// any environment.
const runtimeShape = {
  VITE_OIDC_AUTHORITY: requiredString,
  VITE_OIDC_CLIENT_ID: requiredString,
  VITE_OIDC_REDIRECT_URI: requiredString,
  VITE_OIDC_SCOPE: requiredString,
  VITE_GRAPHQL_API_URL: requiredString,
  VITE_OIDC_API_RESOURCE: optionalString,
  VITE_BASE_URL: optionalString,
  VITE_SENTRY_DSN: optionalString,
  VITE_APP_VERSION: optionalString,
} satisfies Record<string, z.ZodType>;

const runtimeSchema = z.object(runtimeShape);

// Key list derived from the literal above so the two can never drift apart.
// Object.keys preserves the literal's order, which keeps the serialized payload
// byte-identical between server render and client hydration.
const RUNTIME_KEYS = Object.keys(runtimeShape) as (keyof typeof runtimeShape)[];

// Build-time values stay inlined by Vite on purpose: VITE_MOCK_AUTH must not be
// flippable on a running production container, and MODE/PROD/DEV describe the
// bundle itself, not the environment it is deployed into.
const buildTimeSchema = z.object({
  VITE_MOCK_AUTH: optionalString,
  MODE: optionalString,
  PROD: z.boolean().default(false),
  DEV: z.boolean().default(false),
});

type Env = z.infer<typeof runtimeSchema> & z.infer<typeof buildTimeSchema>;

// One source, chosen whole — the object injected into the page OR the process
// environment. Deliberately NOT a per-key merge: a merge would let one source
// quietly stand in for a value the other is missing, which is how a container
// boots green while pointing at the wrong backend.
const readRuntimeSource = (): Record<string, unknown> => {
  const injected = (globalThis as unknown as Record<string, unknown>)[
    RUNTIME_CONFIG_GLOBAL
  ];
  // Browser: set by the inline script in the SSR <head>, so it is already there
  // when this module is first imported during hydration.
  if (injected && typeof injected === "object") {
    return injected as Record<string, unknown>;
  }
  // Node: the SSR server at boot, the Vite dev server, and Vitest — all three
  // have `.env` loaded into `process.env` already (vite.config.ts / Vitest).
  if (typeof process !== "undefined" && process.env) {
    return process.env;
  }
  return {};
};

const source = readRuntimeSource();

// Validate unconditionally (not just in DEV) and fail fast at startup — in
// production too — instead of crashing later with an opaque `new URL` / network
// error. `src/server.ts` imports this module at boot so an unset variable stops
// the server there, with its name in the message, rather than at first render.
const runtimeParsed = runtimeSchema.safeParse(
  Object.fromEntries(RUNTIME_KEYS.map((key) => [key, source[key]])),
);

// Fields are read explicitly (not spread) so Vite can statically inline each
// `import.meta.env.*` access.
const buildTimeParsed = buildTimeSchema.safeParse({
  VITE_MOCK_AUTH: import.meta.env.VITE_MOCK_AUTH,
  MODE: import.meta.env.MODE,
  PROD: import.meta.env.PROD,
  DEV: import.meta.env.DEV,
});

if (!runtimeParsed.success || !buildTimeParsed.success) {
  const issues = [
    ...(runtimeParsed.success ? [] : runtimeParsed.error.issues),
    ...(buildTimeParsed.success ? [] : buildTimeParsed.error.issues),
  ]
    .map((issue) => `${issue.path.join(".")} ${issue.message}`)
    .join(", ");
  throw new Error(`Invalid environment variables: ${issues}`);
}

export const env: Env = { ...runtimeParsed.data, ...buildTimeParsed.data };

// The exact object that is serialized into the HTML: rebuilt from RUNTIME_KEYS
// rather than passed through, so nothing that happens to sit next to it in
// `process.env` can ride along.
const publicRuntimeEnv = Object.fromEntries(
  RUNTIME_KEYS.map((key) => [key, runtimeParsed.data[key]]),
);

// Inline <script> body that publishes the runtime config before any application
// module runs. `<` is escaped so no value can close the tag early.
export const runtimeConfigScript = `window.${RUNTIME_CONFIG_GLOBAL}=${JSON.stringify(
  publicRuntimeEnv,
).replace(/</g, "\\u003c")};`;
