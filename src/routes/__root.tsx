import { useThemeStore } from "@features/theme";
import { getLocale } from "@generated/paraglide/runtime";
import { runtimeConfigScript } from "@shared/config";
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
  // Toasts live in shared/ui, which may not import a feature store, so the
  // theme is read one floor up and handed down. Before rehydration this is the
  // default "cmyk" on both server and client — harmless, since no toast can
  // exist that early.
  const theme = useThemeStore((s) => s.theme);

  return (
    // `data-theme` is intentionally NOT a JSX prop: it's owned entirely by the
    // pre-paint inline script below (and the zustand theme store after hydration).
    // Setting it in JSX would make React reconcile it on hydration and clobber the
    // persisted choice. `suppressHydrationWarning` covers the script-set attribute.
    <html lang={getLocale()} suppressHydrationWarning>
      <head>
        {/* Runtime config: the bundle carries no environment values any
            more, so this script must run before any application module — and
            it does, because those all load from the end of <body>. It is not
            the first tag in the rendered <head>: React hoists what
            <HeadContent /> emits (title, meta, stylesheet, modulepreload)
            above it, and none of that executes application code. Same string
            on both sides — the client rebuilds it from the object this script
            itself defined — so hydration matches. */}
        {/* biome-ignore lint/security/noDangerouslySetInnerHtml: server-built config payload, `<` escaped in shared/config */}
        <script dangerouslySetInnerHTML={{ __html: runtimeConfigScript }} />
        {/* biome-ignore lint/security/noDangerouslySetInnerHtml: trusted static FOUC-prevention script */}
        <script dangerouslySetInnerHTML={{ __html: themeBootstrapScript }} />
        <HeadContent />
      </head>
      <body>
        <Outlet />
        <Toaster closeButton theme={theme === "dark" ? "dark" : "light"} />
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
