import { captureServerException } from "@shared/lib/sentry/server";
import type { Register } from "@tanstack/react-router";
import {
  createStartHandler,
  defaultStreamHandler,
  type RequestHandler,
} from "@tanstack/react-start/server";
import { cookieName } from "./generated/paraglide/runtime";
import { paraglideMiddleware } from "./generated/paraglide/server";

// Long-lived locale cookie (1 year) — the user's resolved locale rarely changes.
const LOCALE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

// Custom SSR entry: wrap Start's request handler in Paraglide's server
// middleware so the server resolves the locale from the request (PARAGLIDE_LOCALE
// cookie, then Accept-Language) and sets up the AsyncLocalStorage context that
// `getLocale()` reads during render. Without this the server always renders
// `baseLocale` ("en"), which mismatches a ru client on hydration.
const handler = createStartHandler(defaultStreamHandler);

const fetch: RequestHandler<Register> = (request, opts) =>
  paraglideMiddleware(
    request,
    async ({ request: localizedRequest, locale }) => {
      // `opts` is `undefined` in practice (no required RequestOptions), but is
      // forwarded to honor the handler signature.
      let response: Response;
      try {
        response = await handler(localizedRequest, opts as never);
      } catch (error) {
        // A rejected SSR render would otherwise propagate to Nitro with no
        // app-level fallback (and lose the Set-Cookie below). Return a minimal
        // 500 so the server stays responsive. The console line only reaches the
        // container log, so the error is also sent to Sentry (no-op without a DSN).
        console.error("SSR render failed", error);
        await captureServerException(error);
        return new Response("Internal Server Error", {
          status: 500,
          headers: { "Content-Type": "text/plain; charset=utf-8" },
        });
      }

      // Persist the server-resolved locale into the PARAGLIDE_LOCALE cookie on the
      // first visit (when no cookie is present yet). `cookie` is the first strategy
      // on the client, so hydration reads back the exact locale the server rendered
      // with — preventing a mismatch when the request's Accept-Language and the
      // browser's navigator.language disagree. A user's explicit choice (which
      // already sets the cookie via setLocale) is never overwritten.
      const hasLocaleCookie = request.headers
        .get("cookie")
        ?.includes(`${cookieName}=`);
      if (!hasLocaleCookie) {
        response.headers.append(
          "Set-Cookie",
          `${cookieName}=${locale}; Path=/; Max-Age=${LOCALE_COOKIE_MAX_AGE}; SameSite=Lax`,
        );
      }
      return response;
    },
  );

export default { fetch };
