const DEFAULT_PORT = "3000";

interface Env {
  VITE_OIDC_AUTHORITY: string;
  VITE_OIDC_CLIENT_ID: string;
  VITE_OIDC_REDIRECT_URI: string;
  VITE_OIDC_SCOPE: string;
  VITE_GRAPHQL_API_URL: string;
  VITE_BASE_URL: string;
  VITE_SENTRY_DSN: string;
  VITE_APP_VERSION: string;
  VITE_MOCK_AUTH: string;
  PORT: string;
  MODE: string;
  PROD: boolean;
  DEV: boolean;
}

const requiredEnvVars: (keyof Env)[] = [
  "VITE_OIDC_AUTHORITY",
  "VITE_OIDC_CLIENT_ID",
  "VITE_OIDC_REDIRECT_URI",
  "VITE_OIDC_SCOPE",
  "VITE_GRAPHQL_API_URL",
];

export const env: Env = {
  VITE_OIDC_AUTHORITY: import.meta.env.VITE_OIDC_AUTHORITY,
  VITE_OIDC_CLIENT_ID: import.meta.env.VITE_OIDC_CLIENT_ID,
  VITE_OIDC_REDIRECT_URI: import.meta.env.VITE_OIDC_REDIRECT_URI,
  VITE_OIDC_SCOPE: import.meta.env.VITE_OIDC_SCOPE,
  VITE_GRAPHQL_API_URL: import.meta.env.VITE_GRAPHQL_API_URL,
  VITE_BASE_URL: import.meta.env.VITE_BASE_URL,
  VITE_SENTRY_DSN: import.meta.env.VITE_SENTRY_DSN,
  VITE_APP_VERSION: import.meta.env.VITE_APP_VERSION,
  VITE_MOCK_AUTH: import.meta.env.VITE_MOCK_AUTH,
  PORT: import.meta.env.PORT || DEFAULT_PORT,
  MODE: import.meta.env.MODE,
  PROD: import.meta.env.PROD,
  DEV: import.meta.env.DEV,
};

if (env.DEV) {
  const missing = requiredEnvVars.filter((key) => !env[key]);
  if (missing.length > 0) {
    console.error(
      `Missing required environment variables: ${missing.join(", ")}`,
    );
  }
}
