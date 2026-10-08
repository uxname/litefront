# Coding standards — how code, tests, styles, text and logs are written

Holds for everything in this repo. Inside the LiteStack meta-repo it refines the root
`.agents/CODING_STANDARDS.md`.

## Tests and coverage floors

- **New logic is written test-first** — the failing test that encodes the contract,
  then the code. Tests check behaviour through roles and ARIA, not class names or lines.
- **Every `shared/ui` component is a trio**: implementation + story + test
  ([TESTING.md → The trio rule](./TESTING.md#the-trio-rule)).
- **Run `npm run test:cov` before you finish.** When the measured coverage rose, raise
  the floors in `vitest.config.ts` to just under the new numbers in the same change — a
  point or two of headroom, no more. A floor left below the real number is a hole new
  untested code can slip through.
- A floor only goes up: when one blocks you, write the missing test.

## Styling

- **Style with the shadcn/ui semantic tokens** — a hardcoded palette colour ignores
  `data-theme` and breaks dark mode ([DESIGN.md → Colour and tokens](./DESIGN.md#colour-and-tokens)).
- **A new primitive comes from `npx shadcn add`**, followed by the two fixes the CLI
  always needs ([DESIGN.md → The shared components](./DESIGN.md#the-shared-components)).
- Tailwind CSS v4, utility-first; keep any module styles scoped. There is no Sass
  preprocessor — add `sass` back if a derived product wants one. Stylelint runs on
  `**/*.css` and allows Tailwind at-rules.

## UI text

All user-facing text — `aria-label` included — goes through Paraglide (`m.<key>()`),
with the key added to every file in `messages/`. How copy reads:
[DESIGN.md → Copy](./DESIGN.md#copy).

## Logs

Report every error with `logError` from `@shared/lib/logger`. `captureException` alone
is a no-op without `VITE_SENTRY_DSN`, and the failure disappears without a trace
([OBSERVABILITY.md](./OBSERVABILITY.md#production-what-a-running-app-tells-you)).

## Code style

- 2-space indent, LF endings, trailing whitespace trimmed (EditorConfig).
- **Biome is the source of truth for formatting**; it formats JS/TS with **double
  quotes** and organizes imports (`organizeImports: on`).
- Unused imports, variables and parameters are **errors** (Biome + TS).
- Prefer small focused functions and explicit interfaces over clever generics.

## TypeScript

- `strict: true` — avoid `any`; prefer typed interfaces and unions.
- `noUnusedLocals` / `noUnusedParameters` are on.
- `useUnknownInCatchVariables` is **false**, so a caught error is typed `any`. Narrow
  it manually — this app's core is error normalization, so don't lean on the default.
- Use the path aliases from `tsconfig.json` rather than deep relative paths
  ([ARCHITECTURE.md](./ARCHITECTURE.md) lists them).
- `tsc --noEmit` currently checks only the app program: `vite.config.ts`,
  `vitest.config.ts` and the two Vite plugins live in `tsconfig.node.json`, which
  nothing typechecks and which has no `strict`. Treat changes there as unchecked and
  verify by running the build.

## Commit messages

Conventional Commits, all lower case: `type(scope): summary` — `feat(ui):`,
`fix(sentry):`, `test(coverage):`. The scope is the area you touched.
