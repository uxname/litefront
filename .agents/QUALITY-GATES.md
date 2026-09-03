# Quality gates — running them, and fixing what they find

## The one rule

**Always use `npm run check` for the full gate. Never run `npm run lint && npm run
ts:check` separately** — that skips knip, steiger, the trio check and Biome's
auto-fix, and the pre-commit hook will then fail on things you thought you had run.

```bash
npm run check          # stylelint + tsc + biome (write) + knip + steiger + trio
npm run verify:commit  # check + gitleaks           (what pre-commit runs)
npm run verify:push    # verify:commit + test:cov + E2E + Ladle build (pre-push)
```

Hooks are thin — all logic is in npm scripts, so the hook and your terminal run
exactly the same thing. There is **no CI**: these hooks are the whole guarantee, and
`--no-verify` has nothing behind it.

> Two honest caveats. `check` runs Biome in **write** mode, so it *fixes* rather than
> fails, and lefthook does not re-stage — what you commit can differ from what was
> checked, so re-check `git diff` after a `check` that changed files. And `secrets`
> silently succeeds when gitleaks is not installed, so a green run on a machine
> without it proves nothing.

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
| "component missing story or test" | trio check | Add the missing file — see [TESTING.md](./TESTING.md) |
| Coverage below floor | Vitest | Add the test. Never lower the floor |

Individual commands, when you need to narrow things down: `lint`, `lint:fix`,
`lint:style`, `ts:check`, `knip`, `lint:fsd`, `trio`.

## Environment

- Copy `.env.example` → `.env` before running anything; nothing creates it for you, and
  the dev-time env checker reads `.env` directly.
- The frontend's `VITE_*` values are inlined at **build** time and are public — never
  put a secret in one.
- Required for auth and data: `VITE_OIDC_AUTHORITY`, `VITE_OIDC_CLIENT_ID`,
  `VITE_OIDC_REDIRECT_URI`, `VITE_OIDC_SCOPE`, `VITE_GRAPHQL_API_URL`.
  `VITE_BASE_URL` builds the OIDC redirect targets, so an empty value breaks sign-out
  and Account Center links. (E2E sets its own, matching the port it serves on.)
  `VITE_MOCK_AUTH=true` disables real authentication — never ship it enabled.
- Cross-project pairs that must match the backend (audience, CORS origin, GraphQL URL)
  are documented in the meta-repo's `docs/ENV-CONTRACT.md` and checked by
  `scripts/doctor.sh`.
- Run `npx playwright install chromium` once after cloning, and again after a
  Playwright version bump.

## Dependencies

- `npm run update` bumps everything via `ncu -u`, reinstalls, then runs `lint:fix` and
  `check`. Prefer updating a few packages at a time (`npx ncu -u <pkg>`) — a full sweep
  makes a breakage hard to attribute.
- **`.ncurc.yml` holds packages back deliberately**, each with the third-party reason
  and the condition that unblocks it. Read it before "fixing" an outdated dependency;
  removing an entry without checking the cause will break `check` or `gen`.
- After updating, re-run the **full** `verify:push`: major bumps of test tooling,
  linters and the FSD plugin change *rules*, not just code, and only the wide gate
  catches that.
- `overrides` in `package.json` force transitive versions, normally to close a
  vulnerability upstream hasn't. Review them after each update: remove one, `npm
  install`, `npm audit` — if the vulnerability stays gone the override is obsolete.
  `npm ls <package>` shows which parent still pulls the old version.

## Bundle size

`npm run build:vite` writes a treemap next to the build output; open it to see what
grew. Usual offenders, in the order they usually pay off:

1. A heavy library pulled into the **root** route's preload — the cost lands on every
   first visit. Load it lazily (this is the case with Sentry's session replay today).
2. A route that isn't code-split.
3. Icons imported wholesale instead of per-icon.
4. Large assets inlined into JS instead of served from `public/`.
