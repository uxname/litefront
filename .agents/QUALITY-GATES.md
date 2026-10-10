# Quality gates — running them, and fixing what they find

## Running the gate

The gate is three npm scripts, each a superset of the one before. The hooks only call
them, so your terminal runs exactly what a commit or a push runs. When done counts:
[AGENTS.md → Every task](../AGENTS.md#every-task), step 3.

```bash
npm run check          # the static gate
npm run verify:commit  # what pre-commit runs
npm run verify:push    # what pre-push runs
```

Each one expands in `package.json`; read the script there for what it covers today.
`check` only reports: when it goes red on formatting, run `npm run lint:fix` and
commit the result.

> One honest caveat: `secrets` silently succeeds when gitleaks is not installed, so
> a green run on a machine without it proves nothing.

## Fixing failures — use the right tool

Each gate has exactly one correct fix. Reaching for Biome on a Steiger error is the
most common wasted loop.

| The error says | Tool | What to actually do |
|---|---|---|
| "Forbidden import from higher layer" | Steiger (FSD) | **Not** a formatting issue. Move the file to the right layer, or invert the dependency. See [ARCHITECTURE.md](./ARCHITECTURE.md) |
| Segment name rejected | Steiger (FSD) | Rename the segment to describe its *purpose* (`bootstrap`, not `providers`) |
| "Unused export" / "Unresolved import" | Knip | Delete the dead code. If the export is real public API, add the barrel to `knip.json`'s `entry`; if an alias is missing there, add it |
| "Type X is not assignable to Y" | TypeScript | Fix the types by hand; don't cast it away |
| Formatting, quotes, import order, simple unused vars | Biome | `npm run lint:fix` (`lint:fix:unsafe` for the rest, reviewed) |
| CSS/SCSS complaints | Stylelint | `npm run lint:style:fix` |
| "component missing story or test" | trio check | Add the missing file to complete the [*trio*](./TESTING.md#the-trio-rule) |
| Coverage below floor | Vitest | Add the test — [a floor only goes up](./CODING_STANDARDS.md#tests-and-coverage-floors) |

Individual commands, when you need to narrow things down: `lint`, `lint:fix`,
`lint:style`, `ts:check`, `knip`, `lint:fsd`, `trio`.

## Environment

- Configure before running anything: copy `.env.example` → `.env`, or export the same
  variables. `.env` is optional — `vite.config.ts` loads it into `process.env`
  (`configDotenv`) **without overriding** anything already exported, and the config module
  reads `process.env`, so both routes end in the same place. A container has no `.env` and
  supplies the variables itself.
- Every `VITE_*` value is public ([AGENTS.md → Guardrails](../AGENTS.md#guardrails)); what
  matters here is **when** each is read. The `runtimeShape` set is read from the
  environment when the **server boots** and shipped to the browser in the SSR HTML, so
  changing one is a restart, not a rebuild. `VITE_MOCK_AUTH` and `VITE_SENTRY_URL` / `VITE_SENTRY_ORG` / `VITE_SENTRY_PROJECT` /
  `VITE_SENTRY_AUTH_TOKEN` are **build-time** instead: mock logins must not be
  switchable on a running container, and the upload token is a real secret that only the
  source-map upload needs.
- Required for auth and data: `VITE_OIDC_AUTHORITY`, `VITE_OIDC_CLIENT_ID`,
  `VITE_OIDC_REDIRECT_URI`, `VITE_OIDC_SCOPE`, `VITE_GRAPHQL_API_URL`.
  `VITE_BASE_URL` builds the OIDC redirect targets, so an empty value breaks sign-out
  and Account Center links. (E2E sets its own, matching the port it serves on.)
  `VITE_MOCK_AUTH=true` replaces real authentication with mock logins.
- Cross-project pairs that must match the backend (audience, CORS origin, GraphQL URL)
  are documented in the meta-repo's `docs/ENV-CONTRACT.md` and checked by
  `scripts/doctor.sh`.
- Before the first E2E run or push, install the browser:
  [TESTING.md → Playwright (E2E)](./TESTING.md#playwright-e2e).

## Dependencies

- `npm run update` bumps everything via `ncu -u` and reinstalls from scratch. Prefer
  updating a few packages at a time (`npx ncu -u <pkg>`) — a full sweep makes a
  breakage hard to attribute.
- **`.ncurc.yml` holds packages back deliberately**, each with the third-party reason
  and the condition that unblocks it. Read it before "fixing" an outdated dependency;
  removing an entry without checking the cause will break `check` or `gen`.
- After updating, re-run the **full** `verify:push`: major bumps of test tooling,
  linters and the FSD plugin change *rules*, not just code, and only the wide gate
  catches that.
- To force a transitive version (usually to close a vulnerability upstream
  hasn't), add an `overrides` block to `package.json` — there is none today.
  Review any you add after each update: remove it, `npm install`, `npm audit` — if
  the vulnerability stays gone the override is obsolete. `npm ls <package>` shows
  which parent still pulls the old version.

## Bundle size

`ANALYZE=true npm run build` writes a treemap next to the build output; open it to see what
grew. Usual offenders, in the order they usually pay off:

1. A heavy library pulled into the **root** route's preload — the cost lands on every
   first visit. Load it lazily with a dynamic `import()`.
2. A route that isn't code-split.
3. Icons imported wholesale instead of per-icon.
4. Large assets inlined into JS instead of served from `public/`.
