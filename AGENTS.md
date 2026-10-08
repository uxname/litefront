# AGENTS.md — litefront (frontend)

Vite · React 19 · TanStack Start (SSR) · URQL · Zustand · Tailwind v4 + shadcn/ui (Radix) ·
Paraglide · Feature-Sliced Design. It also runs standalone; inside the LiteStack meta-repo,
the root `AGENTS.md` adds what spans both sides.

## Every task

1. **Route.** Read the guide the table below names for your task before writing code.
2. **Write to the standard.** Code, tests, styles, UI text and log calls follow
   [.agents/CODING_STANDARDS.md](./.agents/CODING_STANDARDS.md). Everything committed is
   English, whatever language the chat is in.
3. **Done means `npm run check` exits 0** — read the exit status, not the tail of the
   output. It is the whole static gate (compose, stylelint, tsc, Biome, knip, Steiger,
   trio); `lint` or `ts:check` alone runs a fraction of it, and the hook fails on the
   rest. A logic change also needs `npm run test:cov` green.

## Where to look

| Your task | Read |
|---|---|
| **Add** a page, route, slice, component, store, GraphQL operation; touch **SSR**, entry files, auth or locale | [.agents/ARCHITECTURE.md](./.agents/ARCHITECTURE.md) |
| **Tests** or stories to write, a coverage floor blocks you | [.agents/TESTING.md](./.agents/TESTING.md) |
| **Design** a screen: components, tokens, layout, states, UI copy | [.agents/DESIGN.md](./.agents/DESIGN.md) |
| **See** the running app, debug a symptom, trace a production error | [.agents/OBSERVABILITY.md](./.agents/OBSERVABILITY.md) |
| A **gate** is failing; env vars, the Docker image, dependencies, bundle size | [.agents/QUALITY-GATES.md](./.agents/QUALITY-GATES.md) |
| A **seam** with the backend, deploy, the LikeC4 architecture model | the LiteStack meta-repo's `AGENTS.md` — the model lives there only, and moves in the same change |

## Guardrails

- **Regenerate `src/generated/**`** (GraphQL via `npm run gen`, the route tree and
  Paraglide on dev/build); hand edits are lost and no gate notices them.
- **Keep the server stateless.** Production runs several copies behind one proxy: state
  lives in the browser, the backend or the request — not in process memory, not on the
  container's filesystem, not in an assumption that the next request hits the same copy.
- **Read `window` in an effect, an event handler, or behind
  `typeof window === "undefined"`** — render runs on the server too.
- **Treat every `VITE_*` value as public.** Secrets stay out of them, and a shipped
  build has `VITE_MOCK_AUTH` off. `runtimeShape` in `src/shared/config/env.ts` is
  delivered to the browser verbatim; the rest are compiled into the bundle. A test pins
  the exact runtime set, so adding a key is a deliberate act.
- **The hooks are the whole guarantee.** There is no CI, so every commit and push runs
  them; `--no-verify` skips all of it.
