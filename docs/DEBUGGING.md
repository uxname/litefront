# Debugging & diagnostics (frontend)

A runbook for **reading the running UI and triaging failures fast** — written so
a human **or an AI agent** can go from a symptom to a cause without eyes on a
browser. Pair it with [AGENTS.md](../AGENTS.md) ("Frontend observability for AI
agents" and "Theming & i18n").

## How an agent "sees" the frontend (you have no browser)

You cannot watch a live browser console or canvas. Two headless harnesses make
the app observable as files you can read directly — **do not** try to open a
live page.

| Want to know… | Run | Then read |
|---|---|---|
| What the app *does* (console, errors, network) | `npm run test:e2e:logs` | `test-results/frontend-logs.log` (human) / `.json` (structured) |
| What the app *looks like* (layout, theme, spacing) | `npm run test:e2e:screens` | `test-results/screenshots/<route>-<theme>-<viewport>.png` |

The screenshots are real PNGs — read them with the **Read** tool, which renders
images. The matrix is **route × theme × viewport**:

```
test-results/screenshots/
  home-cmyk-desktop.png     home-dark-desktop.png
  home-cmyk-mobile.png      home-dark-mobile.png
  account-cmyk-desktop.png  account-dark-desktop.png   ← /account via mock auth
  404-cmyk-desktop.png      404-dark-desktop.png
  ...
```

Both are **collectors, not strict gates**: they always write their output first,
and only fail on a genuine breakage (a `pageerror` or a same-origin failed
request / 5xx). Plain console noise never fails them, so the full record always
reaches you.

**To look at a specific page/flow or an off-page component state** (e.g. a button
in its loading state, an error fallback), copy `tests/e2e/agent-screens.spec.ts`
or add a temporary route, screenshot it the same way, read the PNG, then remove
the throwaway. That is the canonical way for an agent to "look at" the UI.

> Port note: Playwright reuses an already-running dev server on `:3000`
> (`reuseExistingServer`), so output may come from the dev build (react-scan,
> HMR). For a clean prod capture, stop the dev server first so the harness builds
> + previews fresh.

## The dark-theme check (the bug that keeps coming back)

The whole UI must use daisyUI **semantic tokens** (`bg-base-100/200/300`,
`text-base-content`, `text-primary`, `*-content`), never hardcoded Tailwind
palette colors (`bg-white`, `text-slate-900`, …). Hardcoded colors ignore
`data-theme` and stay light in dark mode — this exact bug is why the theme once
appeared "broken". (Full rule in [AGENTS.md](../AGENTS.md) → "Theming & i18n".)

**How to catch it:** open the `*-cmyk-*` and `*-dark-*` screenshots of the same
route side by side. If a region looks identical (light) in both, it's using
hardcoded colors — fix it to a semantic token and re-capture.

## Symptom → cause → fix

| Symptom | Likely cause | Fix |
|---|---|---|
| Theme toggle does nothing / stays light in dark mode | Hardcoded Tailwind colors instead of daisyUI tokens | Replace with semantic tokens; compare `*-cmyk-*` vs `*-dark-*` screenshots. |
| Locale resets to browser language on reload | Paraglide strategy order wrong | `localStorage` must precede `preferredLanguage` in `vite.config.ts`; requires a **dev-server restart** (compiled into `src/generated/paraglide`). |
| Route is a 404 that should exist | Route tree not regenerated | `npm run gen:routes` (TanStack Router writes `src/generated/routeTree.gen.ts`). |
| GraphQL types missing / `npm run gen` fails | Backend not running / schema stale | Start the backend so `VITE_GRAPHQL_API_URL` (default `http://localhost:4000/graphql`) is live, then `npm run gen`. |
| `/account` shows "Failed to load profile" in screenshots | The GraphQL backend isn't up during capture | Expected when capturing UI-only — the page shell still renders. Start the backend for data-dependent shots. |
| Auth redirect loop / can't reach a protected page | OIDC env missing, or mock off | Set `VITE_OIDC_*` for real auth, or build with `VITE_MOCK_AUTH=true` (the e2e harnesses do this and set `localStorage.isTestAuthenticated`). |
| Blank page / nothing renders | Uncaught error at boot | `npm run test:e2e:logs` → read `frontend-logs.log` for the `pageerror` + stack. |
| Browser CORS error to the API | SPA origin not allowed by the backend | Add `http://localhost:3000` to the backend `CORS_ORIGIN`. |

## Quick reference

- Logs: `npm run test:e2e:logs` → `test-results/frontend-logs.{log,json}`.
- Screenshots: `npm run test:e2e:screens` → `test-results/screenshots/*.png`.
- Storybook (human, interactive): `npm run storybook:serve` (Ladle).
- Full quality gate: `npm run check` (stylelint + tsc + biome + knip + steiger).
- Runtime errors in production go to Sentry (set `VITE_SENTRY_*`).

## Going to production: deeper visual checks (not built in)

This template keeps visual observability to capture-only screenshots on purpose
(no committed baselines — pixel diffs are flaky and need constant
`--update-snapshots`). When a derived project needs more, add (in order of usual
value):

- **Visual regression** — Playwright `toHaveScreenshot` with committed baselines,
  or a hosted service (Chromatic / Percy) for review-time diffs.
- **Accessibility** — `axe` (e.g. `@axe-core/playwright`) to catch contrast and
  ARIA issues the eye misses.
- **Performance budgets** — Lighthouse CI on the built preview.
