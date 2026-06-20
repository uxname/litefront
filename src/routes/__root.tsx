import { getLocale } from "@generated/paraglide/runtime";
import { ErrorFallback } from "@shared/ui/ErrorFallback";
import { Toaster } from "@shared/ui/Toaster";
import {
  createRootRoute,
  HeadContent,
  Outlet,
  Scripts,
  useRouter,
  useRouterState,
} from "@tanstack/react-router";
import React from "react";
// Global stylesheet (Tailwind v4 + daisyUI entry). Imported as a URL and linked
// via head() below, so the <link rel="stylesheet"> is emitted in the SSR <head>
// (no flash of unstyled content). (Previously a side-effect import in main.tsx.)
import appCssUrl from "../index.css?url";

const TanStackRouterDevtools = import.meta.env.DEV
  ? React.lazy(() =>
      import("@tanstack/router-devtools").then((res) => ({
        default: res.TanStackRouterDevtools,
      })),
    )
  : () => null;

// Blocking inline script: set the daisyUI theme from persisted storage BEFORE
// first paint, so an SSR page doesn't flash the default theme for a dark-mode
// user (FOUC) and doesn't mismatch on hydration. Reads the zustand-persist blob
// ("litefront-theme"); falls back to the default "cmyk". The store + ThemeToggle
// reconcile data-theme after hydration, so React must not manage it here
// (hence suppressHydrationWarning on <html>).
const themeBootstrapScript = `
try {
  var raw = localStorage.getItem('litefront-theme');
  var theme = raw ? JSON.parse(raw).state.theme : 'cmyk';
  if (theme === 'dark' || theme === 'cmyk') {
    document.documentElement.dataset.theme = theme;
  }
} catch (_) {}
`;

const RootDocument: React.FC = () => {
  const isDevelopment = import.meta.env.MODE === "development";

  return (
    // `data-theme` is intentionally NOT a JSX prop: it's owned entirely by the
    // pre-paint inline script below (and the zustand theme store after hydration).
    // Setting it in JSX would make React reconcile it on hydration and clobber the
    // persisted choice. `suppressHydrationWarning` covers the script-set attribute.
    <html lang={getLocale()} suppressHydrationWarning>
      <head>
        {/* biome-ignore lint/security/noDangerouslySetInnerHtml: trusted static FOUC-prevention script */}
        <script dangerouslySetInnerHTML={{ __html: themeBootstrapScript }} />
        <HeadContent />
      </head>
      <body>
        <Outlet />
        <Toaster closeButton />
        <Scripts />
        {isDevelopment && (
          <React.Suspense fallback={null}>
            <TanStackRouterDevtools />
          </React.Suspense>
        )}
      </body>
    </html>
  );
};

export const Route = createRootRoute({
  component: RootDocument,
  errorComponent: ({ error, reset }) => {
    const router = useRouter();
    const routerState = useRouterState();

    return (
      <div className="p-4 flex justify-center w-full">
        <ErrorFallback
          error={error}
          reset={reset}
          pathname={routerState.location.pathname}
          onRetry={() => {
            reset();
            router.invalidate();
          }}
        />
      </div>
    );
  },
  head: () => ({
    links: [{ rel: "stylesheet", href: appCssUrl }],
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        title: "LiteFront",
      },
      {
        name: "description",
        content: "Modern Enterprise Boilerplate with React 19, GraphQL and FSD",
      },
      {
        property: "og:type",
        content: "website",
      },
      {
        property: "og:site_name",
        content: "LiteFront App",
      },
    ],
  }),
});
