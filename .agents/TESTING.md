# Testing — the trio rule, TDD, Vitest, Playwright

## The trio rule

**Every `shared/ui` component is a trio**: implementation + story + test, side by
side. A shadcn/ui primitive is flat — `button.tsx`, `button.stories.tsx`,
`button.test.tsx`; a component of our own with helper files is a directory —
`ErrorFallback/ErrorFallback.tsx` with its `.stories.tsx`, `.test.tsx` and an
`index.ts`. The `trio` step in `npm run check`
(`scripts/check-component-trio.mjs`) **fails the build** for either shape missing
its story or test — so `npx shadcn add` is not done until you add both.

A primitive's test checks behaviour through roles and ARIA (`getByRole`,
`toBeDisabled`, `toBeInvalid`, a menu closing on Escape), never its class names:
the classes are shadcn's and change with every update of the registry. jsdom
lacks the pointer, scroll and resize APIs Radix calls; `tests/setup.ts` stubs
them, so an overlay opens in a test like it does in a browser.

## TDD

For features, stores, hooks, utils, schemas and feature/entity components: write the
failing test that encodes the contract, then implement until green.

Coverage floors live in **`vitest.config.ts`** and gate `npm run test:cov` (pre-push).
Read them there rather than trusting a number quoted in prose. How they move — only
up, in the same change: [CODING_STANDARDS.md](./CODING_STANDARDS.md#tests-and-coverage-floors).

## Vitest (unit / component)

```bash
npm run test:dev            # watch
npm run test:prod           # one-shot
npm run test:cov            # coverage, enforces the floors
npm run test:dev -- src/path/to/file.test.tsx    # one file
npx vitest -t "should do X"                      # one test by name
```

Notes that have bitten before:

- **The suite needs the five required `VITE_*` values to exist.** Any test that
  reaches `shared/config`, directly or through a slice, validates the env at import
  time, so with none of them set the run ends in `Invalid environment variables: VITE_OIDC_AUTHORITY is required, …` and
  those files report `(0 test)` — a message that looks like a broken import, not a
  missing variable. Vitest loads `.env` itself, and exported variables work just as
  well (`.env` is optional everywhere — see the meta repo's `docs/ENV-CONTRACT.md`),
  but *something* has to supply them.
- Tests read the developer's real environment — nothing in `tests/setup.ts` stubs
  `import.meta.env`. Take an expected value from a literal: one computed from the same
  env var as the code under test passes no matter what the code does.
- `react-oidc-context` is mocked globally in `tests/setup.ts`, so **no unit or
  component test exercises real auth**. Don't assume auth is covered.
- Assert on the DOM contract you actually care about. `toHaveStyle` compares
  *computed* values (jsdom ≥ 30 resolves `2rem` → `32px`); to assert a value is passed
  through verbatim, read `el.style.<prop>`.
- A unit or component test lives **next to the file it tests** (`src/**/<name>.test.*`),
  and that is the only place. `tests/` holds `setup.ts` and the Playwright suite,
  nothing else — a second tree of tests for the same units is how limits drift silently.

## Playwright (E2E)

```bash
npm run test:e2e:dev        # UI mode
npm run test:e2e:prod       # headless chromium, list reporter
npm run test:all            # unit + e2e
npm run test:e2e:show-trace
npx playwright test tests/e2e/health.spec.ts    # one file
npx playwright test -g "login works"            # one test by name
```

- Specs live in `tests/e2e`; base URL is `http://localhost:3100` (`E2E_PORT` to move it).
- Playwright always builds and starts `npm run start:prod` itself via `webServer`, on
  that dedicated port — it never reuses a running server, so the suite always measures
  the production build, and your dev server on `:3000` can keep running.
- **Run `npx playwright install chromium` once after cloning**, or the pre-push hook
  fails with missing browsers. A Playwright version bump needs it again.
- E2E runs with `VITE_MOCK_AUTH=true`, so the real OIDC flow is never exercised here
  either.
- `tests/e2e/a11y.spec.ts` runs axe on every route in both themes and fails on a
  serious or critical violation — contrast included, which is how a palette change
  that breaks AA gets caught. It emulates reduced motion so entrance animations
  are not measured mid-fade; a new route goes into its `ROUTES` list.
- `forbidOnly` is always on: a leftover `test.only` fails the run instead of quietly
  shrinking the suite to one test.

## Stories (Storybook)

```bash
npm run storybook:serve     # develop stories (http://localhost:61000)
npm run storybook:build     # also part of the pre-push gate, then cleaned up
npm run stories:check       # opens every built story headlessly, in both themes;
                            # fails on a throw, a console error, an empty canvas
                            # or a serious/critical axe (a11y) violation
```

A story file is plain CSF: a default export naming the component, then one named
export per state. No args, no controls — a story here is a function that returns
the component in that state. The one addon is `@storybook/addon-a11y`: its
Accessibility panel shows the same axe findings `stories:check` fails on.

`@storybook/addon-vitest` (stories as Vitest tests) was tried and dropped: its
test file decides whether it is "running from this file" by comparing paths with
only `%20` decoded, so in any checkout whose path has non-ASCII characters every
story file reports "No test suite found". Axe runs in `stories:check` instead.

```tsx
import type { Meta, StoryFn } from "@storybook/react-vite";
import { Button } from "./button";

export default { component: Button } satisfies Meta<typeof Button>;

export const Default: StoryFn = () => <Button>Primary action</Button>;
```

Storybook runs on its own minimal Vite config (`.storybook/vite.config.ts`), not
the production one, and `.storybook/preview.tsx` supplies the runtime config
`@shared/config` needs — so a component that imports the config renders in a
story without any setup of its own. The same file adds the **Theme** toolbar
(`light` / `dark`): it sets `data-theme` on the story's `<html>`, so a
component that only misbehaves in the dark theme can be caught by eye. A
component that takes the theme as a prop instead of reading `data-theme` — the
`Toaster` (`sonner.tsx`) does — must be handed it in the story too, or the toolbar will restyle
everything around it and leave the component itself light.

A story is the component's visual contract: cover each meaningful variant and state,
including loading and error. Agents can't see Storybook — verify visually through the
screenshot harness instead ([OBSERVABILITY.md](./OBSERVABILITY.md)).
