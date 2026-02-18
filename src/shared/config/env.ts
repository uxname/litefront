interface Env {
  VITE_OIDC_AUTHORITY: string;
  VITE_OIDC_CLIENT_ID: string;
  VITE_OIDC_REDIRECT_URI: string;
  VITE_OIDC_SCOPE: string;
  VITE_GRAPHQL_API_URL: string;
  PORT: string;
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
  PORT: import.meta.env.PORT || "3000",
};

if (import.meta.env.DEV) {
  const missing = requiredEnvVars.filter((key) => !env[key]);
  if (missing.length > 0) {
    console.error(
      `Missing required environment variables: ${missing.join(", ")}`,
    );
  }
}
