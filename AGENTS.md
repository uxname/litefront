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
### Vitest (unit/component)
- `npm run test:dev` — interactive/watch
- `npm run test:prod` — run once (CI style)
- `npm run test:cov` — coverage

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

<!-- CODEGRAPH_START -->
## CodeGraph

This project has a CodeGraph MCP server (`codegraph_*` tools) configured. CodeGraph is a tree-sitter-parsed knowledge graph of every symbol, edge, and file. Reads are sub-millisecond and return structural information grep cannot.

### When to prefer codegraph over native search

Use codegraph for **structural** questions — what calls what, what would break, where is X defined, what is X's signature. Use native grep/read only for **literal text** queries (string contents, comments, log messages) or after you already have a specific file open.

| Question | Tool |
|---|---|
| "Where is X defined?" / "Find symbol named X" | `codegraph_search` |
| "What calls function Y?" | `codegraph_callers` |
| "What does Y call?" | `codegraph_callees` |
| "How does X reach/become Y? / trace the flow from X to Y" | `codegraph_trace` (one call = the whole path, incl. callback/React/JSX dynamic hops) |
| "What would break if I changed Z?" | `codegraph_impact` |
| "Show me Y's signature / source / docstring" | `codegraph_node` |
| "Give me focused context for a task/area" | `codegraph_context` |
| "See several related symbols' source at once" | `codegraph_explore` |
| "What files exist under path/" | `codegraph_files` |
| "Is the index healthy?" | `codegraph_status` |

### Rules of thumb

- **Answer directly — don't delegate exploration.** For "how does X work" / architecture questions, answer with 2-3 codegraph calls: `codegraph_context` first, then ONE `codegraph_explore` for the source of the symbols it surfaces. For a specific **flow** ("how does X reach Y") start with `codegraph_trace` from→to — one call returns the whole path with dynamic hops bridged — then ONE `codegraph_explore` for the bodies; don't rebuild the path with `codegraph_search` + `codegraph_callers`. Codegraph IS the pre-built index, so spawning a separate file-reading sub-task/agent — or running a grep + read loop — repeats work codegraph already did and costs more for the same answer.
- **Trust codegraph results.** They come from a full AST parse. Do NOT re-verify them with grep — that's slower, less accurate, and wastes context.
- **Don't grep first** when looking up a symbol by name. `codegraph_search` is faster and returns kind + location + signature in one call.
- **Don't chain `codegraph_search` + `codegraph_node`** when you just want context — `codegraph_context` is one call.
- **Don't loop `codegraph_node` over many symbols** — one `codegraph_explore` call returns several symbols' source grouped in a single capped call, while each separate node/Read call re-reads the whole context and costs far more.
- **Index lag**: the file watcher debounces ~500ms behind writes; don't re-query immediately after editing a file in the same turn.

### If `.codegraph/` doesn't exist

The MCP server returns "not initialized." Ask the user: *"I notice this project doesn't have CodeGraph initialized. Want me to run `codegraph init -i` to build the index?"*
<!-- CODEGRAPH_END -->
