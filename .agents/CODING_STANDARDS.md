# Coding standards — how code, tests, styles, text and logs are written

Holds for everything in this repo. Inside the LiteStack meta-repo it refines the root
`.agents/CODING_STANDARDS.md`.

## Tests and coverage floors

- **New logic is written test-first** ([TESTING.md → TDD](./TESTING.md#tdd)). Tests
  check behaviour through roles and ARIA, not class names or lines.
- **Every `shared/ui` component is a [*trio*](./TESTING.md#the-trio-rule).**
- **Run `npm run test:cov` before you finish.** When the measured coverage rose, raise
  the floors in `vitest.config.ts` to just under the new numbers in the same change — a
  point or two of headroom, no more. A floor left below the real number is a hole new
  untested code can slip through.
- A floor only goes up: when one blocks you, write the missing test.

## Styling

- **Colour comes from a semantic token** ([DESIGN.md → Colour and tokens](./DESIGN.md#colour-and-tokens)).
- **A new primitive comes from `npx shadcn add`**, followed by the two fixes the CLI
  always needs ([DESIGN.md → The shared components](./DESIGN.md#the-shared-components)).
- Tailwind CSS v4, utility-first; keep any module styles scoped. There is no Sass
  preprocessor — add `sass` back if a derived product wants one. Stylelint runs on
  `**/*.css` and allows Tailwind at-rules.

## UI text

All user-facing text, `aria-label` included, goes through Paraglide: the key, the
files it lands in and how copy reads are in [DESIGN.md → Copy](./DESIGN.md#copy).

## Logs

Every failure path leaves exactly one line: one `logError` call — not zero, and not
one per layer it passes through. `logError` comes from `@shared/lib/logger`;
`captureException` alone is a no-op without `VITE_SENTRY_DSN`, and the failure
disappears without a trace ([OBSERVABILITY.md](./OBSERVABILITY.md#production-what-a-running-app-tells-you)).

## Code style and TypeScript

`npm run check` enforces the formatting and compiler rules in `.editorconfig`,
`biome.json` and `tsconfig.json`; read them there. What the configs do not say:

- **Biome is the formatter**, with **double quotes**. The IntelliJ-only
  `ij_*_use_double_quotes = false` lines in `.editorconfig` say otherwise; Biome wins
  on `npm run lint:fix`.
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
