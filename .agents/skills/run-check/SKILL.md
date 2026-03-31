---
name: run-check
description: Use this skill when the user asks to run project checks, verify code quality, run the quality gate, check the project before committing, or validate the codebase. Trigger phrases: "запусти проверку", "проверь проект", "run check", "quality check", "npm run check", "проверь перед коммитом", "validate project".
version: 1.0.0
---

# Run Project Check

Runs the full quality gate and reports results.

## Command

```bash
npm run check
```

This runs in parallel:
1. **stylelint** — CSS/SCSS linting
2. **tsc --noEmit** — TypeScript type checking
3. **biome check --write** — JS/TS linting + auto-format
4. **knip --production** — dead code and unused exports/deps
5. **steiger ./src** — FSD architectural boundary checks

## Interpreting Results

### All green

The project is clean. Safe to commit.

### Biome errors

Auto-fixes are applied during `check`. If errors remain after auto-fix, they require manual resolution. See the `quality-fix` skill.

### TypeScript errors

TypeScript errors are never auto-fixed. Read the error, find the file and line, fix the type issue.

### Knip errors

```
Unused exports: X in src/features/foo/index.ts
```
→ Remove the export or add a consumer.

```
Unlisted dependencies: some-package
```
→ Add to `package.json` dependencies.

### Steiger errors

```
Forbidden cross-layer import: entities/foo imports from features/bar
```
→ Refactor — see the `migrate-fsd` skill.

## Run Individual Checks

When you only need one tool:

```bash
npm run lint          # Biome read-only (no fixes)
npm run lint:fix      # Biome with auto-fixes
npm run ts:check      # TypeScript only
npm run lint:style    # Stylelint only
npm run knip          # Dead code only
npm run lint:fsd      # FSD boundaries only
```

## After Auto-fixes

Biome may modify files during `check`. Review changed files before committing:

```bash
git diff
```

If the auto-fixes look correct, stage them:

```bash
git add -p   # Stage interactively
```
