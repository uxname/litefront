import {
  AUTH_CONFIG_KEYWORDS,
  ERROR_REGEX,
  ErrorCategory,
} from "./errorConfig";

/**
 * The category a backend error code stands for, or `undefined` for a code that
 * names no category of ours (`BAD_USER_INPUT`, anything a future backend adds).
 */
const categoryOfCode = (code: unknown): ErrorCategory | undefined => {
  switch (code) {
    case "UNAUTHENTICATED":
      return ErrorCategory.AUTH;
    case "FORBIDDEN":
      return ErrorCategory.ACCESS;
    case "INTERNAL_SERVER_ERROR":
      return ErrorCategory.SERVER;
    default:
      return undefined;
  }
};

/**
 * The category stated by a failed GraphQL response, when it states one.
 *
 * The backend puts a machine-readable `extensions.code` on every GraphQL error
 * (`backend/internal/graph/errors.go`), and urql hands those errors over on
 * `graphQLErrors`. That is a fact about what happened; the message rules below
 * are a guess at it, so the code is asked first.
 *
 * Duck-typed on purpose, like `extractRequestId`: `shared/ui` must not depend on
 * the GraphQL client's types.
 */
const categoryFromGraphQLErrors = (error: Error): ErrorCategory | undefined => {
  const { graphQLErrors } = error as { graphQLErrors?: unknown };
  if (!Array.isArray(graphQLErrors)) return undefined;

  for (const gqlError of graphQLErrors) {
    const code = (gqlError as { extensions?: { code?: unknown } } | null)
      ?.extensions?.code;
    const category = categoryOfCode(code);
    if (category) return category;
  }
  return undefined;
};

export const detectErrorCategory = (error: Error): ErrorCategory => {
  const stated = categoryFromGraphQLErrors(error);
  if (stated) return stated;

  // Everything that is not a coded GraphQL error — OIDC failures, render
  // errors, a network failure (urql prefixes those with "[Network]") — is
  // classified by what its message says.
  const message = error.message.toLowerCase();
  const match = message.match(ERROR_REGEX);
  const statusCode = match ? Number(match[1]) : null;

  const rules = [
    {
      match: () =>
        message.includes("unauthorized") ||
        message.includes("jwt") ||
        statusCode === 401,
      category: ErrorCategory.AUTH,
    },
    {
      match: () => message.includes("forbidden") || statusCode === 403,
      category: ErrorCategory.ACCESS,
    },
    {
      match: () => AUTH_CONFIG_KEYWORDS.some((kw) => message.includes(kw)),
      category: ErrorCategory.AUTH_CONFIG,
    },
    {
      match: () =>
        message.includes("network") ||
        message.includes("fetch") ||
        statusCode === 503,
      category: ErrorCategory.NETWORK,
    },
    {
      match: () => statusCode && statusCode >= 500,
      category: ErrorCategory.SERVER,
    },
  ];

  return rules.find((r) => r.match())?.category ?? ErrorCategory.UNKNOWN;
};
