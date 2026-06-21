import { z } from "zod";

const DEFAULT_PORT = "3000";

// Required vars: a missing OIDC/API value silently breaks authentication and
// every network call, so they must be present and non-empty.
const requiredString = (name: string) =>
  z.string().min(1, { message: `${name} is required` });

// Optional vars default to "" (not undefined) so consumers keep a plain string
// type and never have to guard against undefined.
const optionalString = z.string().default("");

const envSchema = z.object({
  VITE_OIDC_AUTHORITY: requiredString("VITE_OIDC_AUTHORITY"),
  VITE_OIDC_CLIENT_ID: requiredString("VITE_OIDC_CLIENT_ID"),
  VITE_OIDC_REDIRECT_URI: requiredString("VITE_OIDC_REDIRECT_URI"),
  VITE_OIDC_SCOPE: requiredString("VITE_OIDC_SCOPE"),
  VITE_GRAPHQL_API_URL: requiredString("VITE_GRAPHQL_API_URL"),
  VITE_OIDC_API_RESOURCE: optionalString,
  VITE_BASE_URL: optionalString,
  VITE_SENTRY_DSN: optionalString,
  VITE_APP_VERSION: optionalString,
  VITE_MOCK_AUTH: optionalString,
  // Mirror the old `import.meta.env.PORT || DEFAULT_PORT`: an empty string also
  // falls back to the default, which a plain `.default()` would not do.
  PORT: z
    .string()
    .optional()
    .transform((v) => v || DEFAULT_PORT),
  MODE: optionalString,
  PROD: z.boolean().default(false),
  DEV: z.boolean().default(false),
});

type Env = z.infer<typeof envSchema>;

// Validate unconditionally (not just in DEV) and fail fast at startup — in
// production too — instead of crashing later with an opaque `new URL` / network
// error. Fields are read explicitly (not spread) so Vite can statically inline
// each `import.meta.env.*` access.
const parsed = envSchema.safeParse({
  VITE_OIDC_AUTHORITY: import.meta.env.VITE_OIDC_AUTHORITY,
  VITE_OIDC_CLIENT_ID: import.meta.env.VITE_OIDC_CLIENT_ID,
  VITE_OIDC_REDIRECT_URI: import.meta.env.VITE_OIDC_REDIRECT_URI,
  VITE_OIDC_SCOPE: import.meta.env.VITE_OIDC_SCOPE,
  VITE_OIDC_API_RESOURCE: import.meta.env.VITE_OIDC_API_RESOURCE,
  VITE_GRAPHQL_API_URL: import.meta.env.VITE_GRAPHQL_API_URL,
  VITE_BASE_URL: import.meta.env.VITE_BASE_URL,
  VITE_SENTRY_DSN: import.meta.env.VITE_SENTRY_DSN,
  VITE_APP_VERSION: import.meta.env.VITE_APP_VERSION,
  VITE_MOCK_AUTH: import.meta.env.VITE_MOCK_AUTH,
  PORT: import.meta.env.PORT,
  MODE: import.meta.env.MODE,
  PROD: import.meta.env.PROD,
  DEV: import.meta.env.DEV,
});

if (!parsed.success) {
  const issues = parsed.error.issues.map((issue) => issue.message).join(", ");
  throw new Error(`Invalid environment variables: ${issues}`);
}

export const env: Env = parsed.data;
