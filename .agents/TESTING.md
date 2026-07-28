# Testing — the trio rule, TDD, Vitest, Playwright

Tests are **non-optional** here and the rules are machine-enforced, so they cannot
drift.

## The trio rule

**Every `shared/ui` component is a trio**: `<Name>.tsx` (implementation) +
`<Name>.stories.tsx` (Ladle story) + `<Name>.test.tsx` (Vitest), with a thin
`index.ts` re-export. The `trio` step in `npm run check`
(`scripts/check-component-trio.mjs`) **fails the build** for any `shared/ui`
component missing its story or test.

## TDD

For features, stores, hooks, utils, schemas and feature/entity components: write the
failing test that encodes the contract, then implement until green.

Coverage floors live in **`vitest.config.ts`** and gate `npm run test:cov` (pre-push).
Read them there rather than trusting a number quoted in prose. Ratchet them **up** as
coverage grows; never lower one to dodge a finding.

There is **no CI** — the trio and coverage gates run only in the git hooks, so
`--no-verify` bypasses them with nothing behind it. Don't.

## Vitest (unit / component)

```bash
npm run test:dev            # watch
npm run test:prod           # one-shot
npm run test:cov            # coverage, enforces the floors
npm run test:dev -- src/path/to/file.test.tsx    # one file
npx vitest -t "should do X"                      # one test by name
```

Notes that have bitten before:

- Tests read the developer's real `.env` — `tests/setup.ts`'s
  `vi.stubGlobal("import.meta", …)` does not take effect. Don't write a test whose
  expected value is computed from the same env var as the code under test: it passes
  no matter what the code does.
- `react-oidc-context` is mocked globally in `tests/setup.ts`, so **no unit or
  component test exercises real auth**. Don't assume auth is covered.
- Assert on the DOM contract you actually care about. `toHaveStyle` compares
  *computed* values (jsdom ≥ 30 resolves `2rem` → `32px`); to assert a value is passed
  through verbatim, read `el.style.<prop>`.
- There are duplicated test pairs (`src/**` next to `tests/unit|component/**`) covering
  the same units at different strictness. When you change a contract, grep for **both**
  — a stale duplicate is how limits drift silently.

## Playwright (E2E)

```bash
npm run test:e2e:dev        # UI mode
npm run test:e2e:prod       # headless chromium, list reporter
npm run test:all            # unit + e2e
npm run test:e2e:show-trace
npx playwright test tests/e2e/example.spec.ts   # one file
npx playwright test -g "login works"            # one test by name
```

- Specs live in `tests/e2e`; base URL is `VITE_BASE_URL` or `http://localhost:3000`.
- Playwright starts `npm run start:prod` itself via `webServer`, and reuses an
  already-running dev server on `:3000` when present — so output may come from the dev
  build. Stop the dev server for a clean production capture.
- **Run `npx playwright install chromium` once after cloning**, or the pre-push hook
  fails with missing browsers. A Playwright version bump needs it again.
- E2E runs with `VITE_MOCK_AUTH=true`, so the real OIDC flow is never exercised here
  either.
- `forbidOnly` is always on: a leftover `test.only` fails the run instead of quietly
  shrinking the suite to one test.

## Stories (Ladle)

```bash
npm run storybook:serve     # develop stories
npm run storybook:build     # also part of the pre-push gate, then cleaned up
```

A story is the component's visual contract: cover each meaningful variant and state,
including loading and error. Agents can't see Ladle — verify visually through the
screenshot harness instead ([OBSERVABILITY.md](./OBSERVABILITY.md)).
