# AGENTS.md — litefront (frontend)

Vite · React 19 · TanStack Start (SSR) · URQL · Zustand · Tailwind v4 + daisyUI ·
Paraglide · Feature-Sliced Design.

**This file is the entry point, not the whole manual:** it holds the rules you must not
break and a map of where everything else lives. Read the file that matches your task —
don't read them all.

## Quick start

```bash
npm install                # postinstall installs the git hooks
cp .env.example .env       # nothing creates this for you
npm run start:dev          # Vite dev server with SSR + HMR
npm run check              # the full quality gate — use this, always
```

Build & run: `npm run build:vite` → `.output/` (Nitro Node server +
`.output/public`); `npm run start:prod` runs it (`node .output/server/index.mjs`);
`npm run build` = build + `check`. `docker compose up -d` serves `.output` on port
3000 — the runtime image contains only `.output` and is self-contained.
`VITE_*` values are baked into the bundle at **build** time, so one image = one
environment — build per environment (in Dokploy the app is built at deploy time
with that environment's variables). `npm run docker:build` / `docker:push` build
and push `${IMAGE_REGISTRY:-}litefront:${IMAGE_TAG:-latest}`; the cross-project
deploy guide is the meta repo's `docs/DEPLOY.md`.

## Where to look

| Your task | Read |
|---|---|
| Add a page, route, slice, component, store, GraphQL operation | [.agents/ARCHITECTURE.md](./.agents/ARCHITECTURE.md) |
| Touch routing, SSR, entry files or auth wiring | [.agents/ARCHITECTURE.md](./.agents/ARCHITECTURE.md) |
| Write tests or stories, hit a coverage floor | [.agents/TESTING.md](./.agents/TESTING.md) |
| "See" the running app, debug a symptom, check dark mode | [.agents/OBSERVABILITY.md](./.agents/OBSERVABILITY.md) |
| Styling, theming, i18n strings, TS conventions | [.agents/STYLE.md](./.agents/STYLE.md) |
| A gate is failing, env setup, dependencies, bundle size | [.agents/QUALITY-GATES.md](./.agents/QUALITY-GATES.md) |
| How this side pairs with the backend | meta-repo `AGENTS.md` |

## Golden rules

1. **`npm run check` is the gate.** Never run `lint` and `ts:check` separately — that
   skips knip, steiger, the trio check and Biome's fixes, and the hook will fail on
   what you thought you had run.
2. **Every `shared/ui` component is a trio**: implementation + Ladle story + test. The
   build fails without all three.
3. **New logic is written test-first**, and coverage floors are machine-enforced. Never
   lower a floor to go green — add the test.
4. **Respect FSD boundaries.** Imports point downward only, and cross-slice access goes
   through the slice's `index.ts`. Steiger enforces it, aliases included.
5. **Style with daisyUI semantic tokens, never hardcoded palette colors** — hardcoded
   colors ignore `data-theme` and break dark mode.
6. **Never touch `window` during render.** This tree is server-rendered; read it in an
   effect, an event handler, or behind `typeof window === "undefined"`.
7. **All user-facing text goes through Paraglide** (`m.<key>()`), added to every message
   file.
8. **English-only in the repo** — code, comments, identifiers, commit messages, docs.
   (Chat with the user in their language.)

## Don'ts

- Don't edit `src/generated/**` (GraphQL, route tree, Paraglide) — regenerate.
- Don't use `--no-verify`; there is no CI behind these hooks.
- Don't ship `VITE_MOCK_AUTH=true`, and don't put a secret in a `VITE_*` var — they are
  inlined at build time and public.
- Don't remove a package from `.ncurc.yml` without checking the reason recorded there.
- Don't remove `baseLocale` from the Paraglide strategy, or move `cookie` off first.
- Don't delete `src/app/strip-dangling-sourcemaps.plugin.ts` — the dev log fills with
  false sourcemap errors without it.
- Don't put page logic in `src/routes/*`; those files are route definitions, and that
  directory is the one place Steiger cannot check.
