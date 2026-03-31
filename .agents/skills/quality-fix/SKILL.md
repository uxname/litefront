---
name: quality-fix
description: Use this skill when the user asks to fix linting errors, resolve pre-commit hook failures, fix TypeScript errors, fix Biome issues, or when the lefthook pre-commit check is blocking a commit. Trigger phrases: "fix lint errors", "lefthook fails", "pre-commit failed", "biome errors", "ts errors".
version: 1.0.0
---

# Quality Fix

Resolves issues caught by the project's quality gate.

## Quality Gate Pipeline

`npm run check` runs these tools in parallel:

```
stylelint → tsc → biome --fix → knip → steiger
```

This same pipeline runs on every `git commit` via Lefthook.

## Step 1: Run the full check

```bash
npm run check
```

Read the output carefully — each tool reports separately.

## Step 2: Fix by tool

### Biome (TypeScript/JS linting + formatting)

Biome auto-fixes most issues:

```bash
npm run lint:fix          # Safe auto-fixes
npm run lint:fix:unsafe   # Also unsafe fixes (use with caution)
```

Common manual fixes:
- **Unused import** — delete the import line
- **Unused variable** — delete or prefix with `_` if intentional
- **`any` type** — replace with a proper type or `unknown`
- **Missing return type** — add explicit return type annotation

### TypeScript (`tsc --noEmit`)

```bash
npm run ts:check
```

Common fixes:
- Type mismatch — align types between caller and callee
- Missing property — add to interface or mark optional with `?`
- Implicit `any` — add explicit type annotation

### Stylelint (CSS/SCSS)

```bash
npm run lint:style:fix   # Auto-fix
npm run lint:style       # Check only
```

### Knip (dead code / unused exports)

```bash
npm run knip
```

Knip reports:
- **Unused exports** — remove the export or add a consumer
- **Unused files** — delete the file or import it somewhere
- **Unused dependencies** — remove from `package.json`

Do not suppress Knip errors with ignores unless the export is intentionally part of a public API.

### Steiger (FSD boundaries)

```bash
npm run lint:fsd
```

FSD violations to fix:
- **Cross-layer import** — entity importing from feature → move logic or use a different pattern
- **Cross-slice import** — one feature directly importing from another feature → extract to shared or use events

See the `migrate-fsd` skill for refactoring guidance.

## Common Pre-commit Failure Patterns

| Error | Fix |
|---|---|
| `import X is defined but never used` | Delete the import |
| `variable is assigned but never used` | Delete or use the variable |
| `Type 'X' is not assignable to type 'Y'` | Fix the type mismatch |
| `Module '"@entities/foo"' has no exported member` | Check `index.ts` exports |
| `Forbidden cross-layer import` | Move code to the correct layer |
| `Unused export 'X'` | Remove export or add a consumer |

## Quick Full Fix Sequence

```bash
npm run lint:fix          # Auto-fix Biome issues
npm run lint:style:fix    # Auto-fix CSS/SCSS
npm run ts:check          # Identify remaining TS errors (fix manually)
npm run check             # Confirm everything passes
```
