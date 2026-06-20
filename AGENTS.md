# AGENTS.md — LiteFront Repository Guide

This file is for agentic tools working in this repo. Follow these commands and
conventions to stay aligned with existing tooling and architecture.

## Quick Start
- Install: `npm install`
- Dev server: `npm run start:dev`
- Full quality gate: `npm run check` (runs stylelint, tsc, biome fix, knip, steiger)

## IMPORTANT — Quality Gate Rule
- **Always** use `npm run check` for the full quality gate.
- **Never** call `npm run lint && npm run ts:check` separately — this skips knip, steiger, and biome auto-fix, which will cause pre-commit (lefthook) to fail. Rely on `npm run check` exclusively.

## Build / Run
- `npm run start:dev` — Vite dev server (HMR)
- `npm run start:prod` — Vite preview (serves build)
- `npm run build` — Production build + `check`
- `npm run build:vite` — Vite build only

## Lint / Format / Typecheck
- `npm run lint` — Biome check (read-only)
- `npm run lint:fix` — Biome check + write fixes
- `npm run lint:fix:unsafe` — Biome fix incl. unsafe
- `npm run lint:style` — Stylelint (CSS/SCSS)
- `npm run lint:style:fix` — Stylelint auto-fix
- `npm run ts:check` — `tsc --noEmit`
- `npm run knip` — Dead code & unused exports/deps
- `npm run lint:fsd` — FSD boundary checks (Steiger)
- `npm run check` — Runs stylelint + tsc + biome fix + knip + steiger

## Testing

### Component & test discipline (the "trio" + TDD) — READ THIS
This project treats tests as **non-optional**, and the rule is machine-enforced
so it cannot drift:

- **Every `shared/ui` component is a trio**: `<Name>.tsx` (impl) +
  `<Name>.stories.tsx` (Ladle story) + `<Name>.test.tsx` (Vitest test), with a
  thin `index.ts` re-export. The `trio` step in `npm run check`
  (`scripts/check-component-trio.mjs`) **fails the build** for any `shared/ui`
  component missing its story or test. Use the `new-component` / `add-story` /
  `write-tests` skills.
- **New business logic is written test-first (TDD).** For features, stores,
  hooks, utils, schemas and feature/entity components: write the failing test
  that encodes the contract, then implement until green. New code that drops
  coverage below the floors in `vite.config.ts` (lines/statements 82, functions
  85, branches 78) fails `npm run test:cov` — locally and in CI. Ratchet the
  floors **up** as coverage grows; never lower one to dodge a finding.
- Both gates run in CI (`.github/workflows/ci.yml`), so `--no-verify` cannot
  bypass them.

### Vitest (unit/component)
- `npm run test:dev` — interactive/watch
- `npm run test:prod` — run once (CI style)
- `npm run test:cov` — coverage (enforces the thresholds above)

**Single test file**
- `npm run test:dev -- src/path/to/file.test.tsx`
- `npx vitest src/path/to/file.test.tsx`

**Single test by name**
- `npx vitest -t "should do X"`
- `npm run test:dev -- -t "should do X"`

### Playwright (E2E)
- `npm run test:e2e:dev` — UI mode
- `npm run test:e2e:prod` — headless chromium + list reporter
- `npm run test:all` — unit + e2e
- `npm run test:e2e:show-trace` — view trace zip

**Single E2E file**
- `npx playwright test tests/e2e/example.spec.ts`

**Single E2E test by name**
- `npx playwright test -g "login works"`

**Run a specific browser**
- `npx playwright test --project=chromium`

**Notes**
- E2E tests live in `tests/e2e` (see `playwright.config.ts`).
- Base URL uses `VITE_BASE_URL` or defaults to `http://localhost:3000`.
- Playwright starts `npm run start:prod` via `webServer` in config.

## Frontend observability for AI agents (READ THIS — you cannot see the browser)

An AI agent has no eyes on a browser console. To **read what the frontend actually
does at runtime** — `console.*`, uncaught errors, unhandled promise rejections, failed
network requests — use the **agent log harness**, a Playwright spec that drives the app
headlessly and dumps everything to files you can read.

```bash
npm run test:e2e:logs
```

Then read the captured output (do NOT try to watch a live browser):
- `test-results/frontend-logs.log` — human-readable, one line per event.
- `test-results/frontend-logs.json` — same data, structured (parse this).

How it works (`tests/e2e/agent-logs.spec.ts`):
- Walks the key routes (`/`, `/protected`, a 404), then exercises the theme + locale
  switchers, capturing every console/error/network event along the way.
- `/protected` renders because the harness sets `localStorage.isTestAuthenticated`
  (mock-auth path, same as `tests/e2e/pages/account.spec.ts`).
- react-scan render-profiling noise is filtered out so the log stays signal.
- It is a **collector**, not a strict gate: plain console output never fails it, but a
  **`pageerror` or a same-origin failed request DOES fail it** — those are real
  breakages you must surface and fix.

**To debug a specific page/flow**, copy this spec, change the routes/interactions, and
read the same output files. This is the canonical way for an agent to "look at" the UI.

### Seeing the UI (not just the logs)

Logs tell you what the app *did*; they don't show what it *looks like*. For layout,
spacing, and especially **theme** work, use the **screenshot harness** — it drives the
app headlessly and writes a full-page PNG for every key route, in **both daisyUI themes**
(`cmyk`/`dark`) at **desktop + mobile** widths:

```bash
npm run test:e2e:screens
```

Then **read the PNGs with the Read tool** (it renders images) — do NOT open a live browser:
- `test-results/screenshots/<route>-<theme>-<viewport>.png`, e.g. `home-dark-mobile.png`.

It's the same collector contract as the log harness (always writes; fails only on a real
`pageerror`/same-origin failure). Comparing `*-cmyk-*` vs `*-dark-*` is how you catch the
hardcoded-color dark-mode bug (see "Theming & i18n" below). Full triage workflow and a
symptom → cause → fix matrix live in [docs/DEBUGGING.md](./docs/DEBUGGING.md).

> Port note: Playwright reuses an already-running dev server on `:3000` when present
> (`reuseExistingServer`), so logs may come from the dev build (react-scan, HMR). For a
> clean prod capture, stop the dev server first so the harness builds + previews fresh.

## Theming & i18n (how the switchers work — don't re-break them)

**Theme (daisyUI).** Two themes are declared in `src/index.css`
(`cmyk` = light/default, `dark`). The toggle (`src/features/theme`) is a zustand store
that sets `document.documentElement[data-theme]` and persists to `localStorage`
(`litefront-theme`), re-applied on rehydrate.
- **The whole UI must be styled with daisyUI SEMANTIC tokens, not hardcoded Tailwind
  palette colors.** Use `bg-base-100/200/300`, `text-base-content` (+ `/60` for muted),
  `border-base-300`, `text-primary`, `text-error/success/info/warning`, `*-content` for
  text on accent fills. **Never** use `bg-white`, `text-slate-900`, `text-indigo-600`,
  `bg-red-50`, etc. — those ignore `data-theme` and stay light in dark mode (this exact
  bug is why the theme appeared "broken"). Decorative gradient orbs are the only allowed
  exception.

**i18n (Paraglide JS).** Messages live in `messages/{en,ru}.json`; generated accessors in
`src/generated/paraglide`. Switcher: `src/features/locale`. Strategy is set in
`vite.config.ts`:
```ts
strategy: ["localStorage", "preferredLanguage", "baseLocale"]
```
- **`localStorage` MUST come before `preferredLanguage`** so an explicit user choice
  (`setLocale`) persists and wins over the browser language on reload. A strategy of
  `["preferredLanguage"]` alone silently discards the choice on every reload (the original
  bug). Changing strategy requires a **dev-server restart / rebuild** (it's compiled into
  `src/generated/paraglide/runtime.js`).
- Add strings via the `add-translation` skill; keep `en.json` and `ru.json` in sync.

## Codegen / Routing
- `npm run gen` — GraphQL codegen (reads `src/graphql/**/*.graphql`)
- `npm run gen:routes` — TanStack Router route tree (`src/generated/routeTree.gen.ts`)
- Run `gen` after changing GraphQL schema or operations.
- `gen` requires `VITE_GRAPHQL_API_URL` (see `.env` / `.env.example`).

## Environment Setup
- Copy `.env.example` to `.env` before running the app.
- Required vars for auth/data: `VITE_OIDC_AUTHORITY`, `VITE_OIDC_CLIENT_ID`,
  `VITE_OIDC_REDIRECT_URI`, `VITE_OIDC_SCOPE`, `VITE_GRAPHQL_API_URL`.
- Test base URL and routing use `VITE_BASE_URL` (defaults to `http://localhost:3000`).

## Code Style & Formatting (Biome + EditorConfig)
- Indent with 2 spaces, LF line endings, trim trailing whitespace.
- Use Biome as the source of truth for formatting.
- Quotes: Biome formats JS/TS with **double quotes**.
- Imports are organized by Biome (`organizeImports: on`).
- Unused imports/vars/params are **errors** (Biome + TS).
- Prefer small, focused functions (< 50 lines) and explicit interfaces.

## TypeScript Conventions
- `strict: true` — avoid `any`; prefer typed interfaces and unions.
- `noUnusedLocals` / `noUnusedParameters` enforced.
- `useUnknownInCatchVariables` is false, but still narrow errors manually.
- Prefer immutable updates and pure functions.
- Use path aliases from `tsconfig.json`:
  - `@shared/*`, `@entities/*`, `@features/*`, `@widgets/*`, `@pages/*`
  - `@generated/*`, `@public/*`

## Architecture (Feature-Sliced Design)
- Layers: `shared`, `entities`, `features`, `widgets`, `pages`, `app`.
- Respect FSD boundaries; Steiger enforces architectural rules.
- Keep slices small and composable; avoid “god” modules.
- Favor composition and explicit dependencies (DI) over hidden imports.

## Error Handling
- Validate inputs at boundaries; return structured errors when possible.
- Avoid swallowing errors; log or rethrow where appropriate.
- For UI failures, prefer error boundaries and explicit fallback states.

## Styling
- Tailwind CSS v4 + SCSS Modules are used.
- Stylelint runs on `**/*.{css,scss}` and allows SCSS at-rules.
- Prefer utility-first styling with Tailwind; keep module styles scoped.

## Generated Code
- `src/generated/**` is generated (GraphQL + route tree).
- Do not edit generated files by hand; regenerate instead.
- Biome/Knip ignore generated output.
- This includes `src/generated/routeTree.gen.ts` and `src/generated/graphql.tsx`.

## Storybook (Ladle)
- `npm run storybook:serve` — start Ladle
- `npm run storybook:build` — build static Ladle
- `npm run storybook:preview` — preview built storybook

## Monitoring / DX
- Sentry integration is configured via Vite plugin; set `VITE_SENTRY_*` vars for builds.
- React Scan is available for performance debugging in development.

## Git Hooks / Quality Gate
- Lefthook runs `npm run check` on pre-commit.
- Expect auto-fixes from Biome during `check`.

## Skills

Skills live in `.agents/skills/`. Each skill is a `SKILL.md` file that guides agents through a specific workflow.

**All skill content must be written in English only.** This applies to descriptions, instructions, comments, and any other text inside SKILL.md files.

## Cursor / Copilot Rules
- No `.cursor/rules`, `.cursorrules`, or `.github/copilot-instructions.md` found.
