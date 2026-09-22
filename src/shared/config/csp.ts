// Content-Security-Policy of every server-rendered page.
//
// Built per request on the server from the runtime config, because the origins
// the browser may talk to (API, IdP, Sentry) are deployment values, not build
// values — the same image runs everywhere. OIDC tokens live in localStorage, so
// this policy is the layer that keeps an injected script from running at all.

/**
 * Internal request header carrying the request's nonce from the SSR entry to
 * the router. The entry always overwrites it, so a client cannot pick a nonce.
 */
export const CSP_NONCE_HEADER = "x-litefront-csp-nonce";

type CspOrigins = {
  VITE_GRAPHQL_API_URL: string;
  VITE_OIDC_AUTHORITY: string;
  VITE_SENTRY_DSN: string;
};

// The origin of a configured URL, or nothing for an empty/invalid value (a
// missing optional DSN, say) — never a malformed source that voids the policy.
const originOf = (url: string): string[] => {
  if (!url) return [];
  try {
    return [new URL(url).origin];
  } catch {
    return [];
  }
};

/** The policy for one response; `nonce` is that request's script nonce. */
export const buildCsp = (nonce: string, origins: CspOrigins): string => {
  const api = originOf(origins.VITE_GRAPHQL_API_URL);
  const idp = originOf(origins.VITE_OIDC_AUTHORITY);
  const sentry = originOf(origins.VITE_SENTRY_DSN);
  // Avatars come from object storage or the IdP's picture claim — any host.
  // http: serves local builds; on an https page the browser upgrades or blocks
  // such an image as mixed content anyway, and images cannot run code.
  const images = ["'self'", "https:", "http:", "data:", "blob:"];

  return [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}'`,
    // sonner injects a <style> element and components set inline style
    // attributes; neither can carry a nonce. Styles cannot run code.
    "style-src 'self' 'unsafe-inline'",
    `img-src ${images.join(" ")}`,
    ["connect-src 'self'", ...api, ...idp, ...sentry].join(" "),
    // oidc-client-ts falls back to a hidden IdP iframe for silent renew.
    ["frame-src", ...(idp.length ? idp : ["'none'"])].join(" "),
    // Sentry Replay compresses in a blob: worker.
    "worker-src 'self' blob:",
    // /callback runs in that same-origin iframe; nobody else may frame us.
    "frame-ancestors 'self'",
    ["form-action 'self'", ...idp].join(" "),
    "base-uri 'self'",
    "object-src 'none'",
  ].join("; ");
};

/** A fresh 128-bit script nonce, base64. */
export const newCspNonce = (): string => {
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  return btoa(String.fromCharCode(...bytes));
};
