# AGENTS.md — litefront (frontend)

Vite · React 19 · TanStack Start (SSR) · URQL · Zustand · Tailwind v4 + daisyUI ·
Paraglide · Feature-Sliced Design.

**This file is the entry point, not the whole manual:** it holds the rules you must not
break and a map of where everything else lives. Read the file that matches your task —
don't read them all.

## Quick start

```bash
npm install                # postinstall installs the git hooks
cp .env.example .env       # nothing creates it; exported env vars work instead
npm run start:dev          # Vite dev server with SSR + HMR
npm run check              # the full quality gate — use this, always
```

`npm run gen` regenerates the GraphQL types from the **live** schema, so it needs
`VITE_GRAPHQL_API_URL` in the environment (`.env` is one way to put it there, an
exported variable is another) and the backend reachable at it. Unset, the address becomes the string `undefined` and the
error reads `Failed to load schema from undefined` — it never says "variable".

Build & run: `npm run build:vite` → `.output/` (Nitro Node server +
`.output/public`); `npm run start:prod` runs it (`node .output/server/index.mjs`);
`npm run build` = build + `check`. `docker compose up -d` serves `.output` on port
3000 — the runtime image contains only `.output` and is self-contained.

**The image carries no environment.** The public values are read from the
container's environment when the server boots, so the same image runs anywhere and
a tag names the code only. `src/shared/config/env.ts` holds the one list of them;
five are required (`VITE_OIDC_AUTHORITY`, `VITE_OIDC_CLIENT_ID`,
`VITE_OIDC_REDIRECT_URI`, `VITE_OIDC_SCOPE`, `VITE_GRAPHQL_API_URL`) and the server
refuses to boot without one, naming it. Four values belong to the **build**
instead: `VITE_MOCK_AUTH`, and `VITE_SENTRY_ORG` / `VITE_SENTRY_PROJECT` /
`VITE_SENTRY_AUTH_TOKEN` for source-map upload. `.env` is for local runs only — it
is excluded from the build context, so it can never reach an image.
`npm run docker:build` / `docker:push` build and push
`${IMAGE_REGISTRY:-}litefront:${IMAGE_TAG:-latest}`; the cross-project deploy guide
is the meta repo's `docs/DEPLOY.md`.

Production runs several copies of this server behind one proxy, so keep it that
way: no per-process state, nothing written to the container's filesystem, and
nothing that assumes the next request lands on the same copy.

## Where to look

| Your task | Read |
|---|---|
| Add a page, route, slice, component, store, GraphQL operation | [.agents/ARCHITECTURE.md](./.agents/ARCHITECTURE.md) |
| Touch routing, SSR, entry files or auth wiring | [.agents/ARCHITECTURE.md](./.agents/ARCHITECTURE.md) |
| Write tests or stories, hit a coverage floor | [.agents/TESTING.md](./.agents/TESTING.md) |
| "See" the running app, debug a symptom, check dark mode | [.agents/OBSERVABILITY.md](./.agents/OBSERVABILITY.md) |
| How a screen should look: components, layout, states, UI copy | [.agents/DESIGN.md](./.agents/DESIGN.md) |
| Code style, TypeScript conventions, generated code, locale wiring | [.agents/ARCHITECTURE.md](./.agents/ARCHITECTURE.md) |
| A gate is failing, env setup, dependencies, bundle size | [.agents/QUALITY-GATES.md](./.agents/QUALITY-GATES.md) |
| How this side pairs with the backend | meta-repo `AGENTS.md` |
| The architecture diagram (LikeC4) | it lives in the LiteStack meta-repo (`docs/architecture/likec4/`) — update it there, never start a second model here |

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
   colors ignore `data-theme` and break dark mode. The rest of the UI rules are in
   [.agents/DESIGN.md](./.agents/DESIGN.md).
6. **Never touch `window` during render.** This tree is server-rendered; read it in an
   effect, an event handler, or behind `typeof window === "undefined"`.
7. **All user-facing text goes through Paraglide** (`m.<key>()`), added to every message
   file.
8. **English-only in the repo** — code, comments, identifiers, commit messages, docs.
   (Chat with the user in their language.)

## Don'ts

- Don't edit `src/generated/**` (GraphQL, route tree, Paraglide) — regenerate.
- Don't use `--no-verify`; there is no CI behind these hooks.
- Don't ship `VITE_MOCK_AUTH=true`, and don't put a secret in a `VITE_*` var — every one
  of them is public. The list in `src/shared/config/env.ts` is delivered to the browser
  verbatim; the rest are compiled into the JS bundle, which is just as readable. Adding a
  key to that list publishes it, and a test asserts the exact set, so it cannot grow by
  accident.
- Don't remove a package from `.ncurc.yml` without checking the reason recorded there.
- Don't remove `baseLocale` from the Paraglide strategy, or move `cookie` off first.
- Don't delete `src/app/strip-dangling-sourcemaps.plugin.ts` — the dev log fills with
  false sourcemap errors without it.
- Don't put page logic in `src/routes/*`; those files are route definitions, and that
  directory is the one place Steiger cannot check.
- Don't report an error through `captureException` alone — call `logError` from
  `@shared/lib/logger`. `VITE_SENTRY_DSN` is optional, and without it
  `captureException` is a no-op and the failure disappears without a trace. See
  [.agents/OBSERVABILITY.md](./.agents/OBSERVABILITY.md#production-what-a-running-app-tells-you).
