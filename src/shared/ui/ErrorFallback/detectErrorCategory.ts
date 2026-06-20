import {
  AUTH_CONFIG_KEYWORDS,
  ERROR_REGEX,
  ErrorCategory,
} from "./errorConfig";

export const detectErrorCategory = (error: Error): ErrorCategory => {
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
