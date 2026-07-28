# Architecture — SSR, FSD, and how to add things

## SSR (TanStack Start) — read before touching routing, entry or auth

This app runs **server-side rendered** via TanStack Start (Vite plugin + Nitro
`node-server`). Public routes render on the server; auth-only routes opt out with
`ssr: false`.

- **Entry files** (wired by the Start plugin): `src/router.tsx` exports `getRouter()`;
  `src/client.tsx` hydrates and runs browser-only side effects (Sentry, react-scan);
  `src/server.ts` is the SSR handler (wraps Start's handler in Paraglide's locale
  middleware); `src/start.ts` sets `defaultSsr: true`. There is **no** `main.tsx` and
  **no** `index.html` — `src/routes/__root.tsx` renders the whole `<html>` document.
- **Providers** (auth + GraphQL) are injected via the router's `Wrap` option in
  `src/app/bootstrap/AppProviders.tsx` (isomorphic): the server renders
  `NeutralAuthProvider` (always logged-out, SSR-safe); the client mounts the real
  `react-oidc-context` `AuthProvider`, or `MockAuthProvider` when `VITE_MOCK_AUTH`.
  OIDC is browser-only, so `getOidcConfig()` is lazy.
- **Anything rendered on both sides must not touch `window` during render.** Read it
  in an effect, in an event handler, or behind `typeof window === "undefined"`. This
  bit twice: the error boundary's own fallback crashed the server render.
- **Hydration safety**: auth-dependent UI must render its logged-out markup while
  `isLoading` (see `HeaderControls`) so the first client paint matches the server's
  neutral render. `MockAuthProvider` defers its `localStorage` read to an effect for
  the same reason.
- **FOUC**: the daisyUI theme is applied pre-paint by a blocking inline script in
  `__root.tsx`; the locale is resolved server-side from the `PARAGLIDE_LOCALE` cookie,
  so `<html lang>` and messages agree on hydration. The theme key exists in **two**
  places — the store and that inline script — keep them identical.
- **Security/caching headers** are Nitro `routeRules` in `vite.config.ts` (not a web
  server). `robots.txt` is a static file in `public/`. There is no sitemap plugin.
- **Dev console noise**: `src/app/strip-dangling-sourcemaps.plugin.ts` suppresses
  `Failed to load source map … ENOENT` from `@tanstack/*-start*` packages shipping
  sourcemap comments without the `.map` files. Don't remove it or the dev log fills
  with false errors.

## Feature-Sliced Design

| Layer | Path | May import from |
|---|---|---|
| `app` | `src/app/` | anything |
| `pages` | `src/pages/` | widgets, features, entities, shared |
| `widgets` | `src/widgets/` | features, entities, shared |
| `features` | `src/features/` | entities, shared |
| `entities` | `src/entities/` | shared only |
| `shared` | `src/shared/` | nothing internal |

Steiger (`npm run lint:fsd`) enforces this, **including imports written through
`@…/*` aliases** — run it after creating or moving a slice.

Two things it does *not* cover, so watch them by hand:

- **`src/routes/` is not an FSD layer.** It is the one place that may reference every
  layer, and it is unchecked. Keep route files to `createFileRoute` + `head()` +
  a component imported from `pages/`; today `account.tsx` and `callback.tsx` hold page
  logic, which is the pattern *not* to copy.
- Segment names must describe **purpose**, not contents. `providers`, `hooks`,
  `utils`, `helpers`, `types` are rejected by the FSD plugin — that is why the app
  layer's segment is `bootstrap`, not `providers`.

### Slice structure

```
src/<layer>/<slice>/
  index.ts        # public API — the ONLY entry other slices import
  ui/             # components
  model/          # store, types, business logic
  api/            # data access (generated GraphQL hooks live behind this)
  lib/            # slice-local helpers
```

Cross-slice imports go through `index.ts`. Reaching into `…/model/store` from another
slice is a boundary violation even when it type-checks.

Path aliases (`tsconfig.json`): `@shared/*`, `@entities/*`, `@features/*`,
`@widgets/*`, `@pages/*`, `@generated/*`, `@public/*`. `knip.json` duplicates this
list — add new aliases to both or knip reports phantom dead code.

## How to add things

- **A page/route** → `src/routes/<name>.tsx` with `createFileRoute` and `head()`
  (title + description + `robots` for private pages); put the component in
  `src/pages/<name>/`. The route tree (`src/generated/routeTree.gen.ts`) is generated
  by the Start plugin on dev/build — never edit it.
- **A protected page** → mark the route `ssr: false` and guard **inside the
  component** with `useAuth()`. There is no server session and no `context.auth` on
  the router; `beforeLoad` + `context.auth` was removed. Remember the return
  location as `pathname + search` (an absolute URL breaks `history.replace`).
- **A shared UI component** → `src/shared/ui/<Name>/` as a **trio** (see
  [TESTING.md](./TESTING.md)); style with daisyUI semantic tokens only (see
  [STYLE.md](./STYLE.md)).
- **A store** → Zustand in `src/<layer>/<slice>/model/store.ts`, exported from the
  slice's `index.ts`; subscribe with a **selector** (`useX(s => s.field)`) so
  unrelated updates don't re-render. Persisted stores must re-apply their side
  effects on rehydrate.
- **A GraphQL operation** → write it in `src/graphql/**/*.graphql`, run `npm run gen`
  (needs the backend running — see the meta-repo's cross-project notes), then consume
  the generated hook from the slice's `api/` segment, never directly in `ui/`.
- **A new dependency** → check the stdlib and what's already installed first; the
  project is deliberately small.
