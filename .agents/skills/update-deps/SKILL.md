---
name: update-deps
description: Use this skill when the user asks to update dependencies, upgrade packages, update npm packages, or keep the project up to date. Trigger phrases: "update dependencies", "upgrade packages", "npm update", "update npm".
version: 1.0.0
---

# Update Dependencies

Updates project dependencies using the project's interactive update workflow.

## Update Command

```bash
npm run update
```

This does:
1. `npx ncu -u` — bumps all versions in `package.json` to latest
2. `npx rimraf node_modules package-lock.json` — cleans old install
3. `npm install` — fresh install with new versions
4. `npm run lint:fix && npm run check` — auto-fix and verify (postinstall hook)

**This updates ALL dependencies at once.** It's aggressive — see selective update below for safer approach.

## Selective Update (Safer)

To update specific packages only:

```bash
npx ncu -u react react-dom @types/react   # Update specific packages
npm install                                 # Reinstall
npm run check                               # Verify
```

To preview what would change without applying:

```bash
npx ncu   # Shows available updates without modifying package.json
```

## High-Risk Packages (Extra Caution)

These packages often have breaking changes — read the changelog before updating:

| Package | Why risky |
|---|---|
| `vite` | Plugin API changes, config options |
| `@tanstack/react-router` | Route file conventions, type signatures |
| `@biomejs/biome` | New lint rules that fail existing code |
| `tailwindcss` | CSS utility naming changes (v3→v4 was major) |
| `typescript` | Stricter type checking may break existing code |
| `@inlang/paraglide-js` | Generated API changes |
| `@graphql-codegen/*` | Generated hook signatures |

## After Updating

1. Run `npm run check` — fixes lint issues and validates types
2. Run `npm run test:prod` — ensure no regressions
3. Run `npm run build:vite` — verify production build works
4. Check browser in dev mode for runtime errors: `npm run start:dev`

## If Something Breaks

Revert specific packages:

```bash
# Reinstall a specific version
npm install vite@7.0.0

# Or revert package.json and reinstall
git checkout package.json
npm install
```

## Checklist

- [ ] Preview changes with `npx ncu` before applying
- [ ] Check changelogs of high-risk packages
- [ ] `npm run check` passes after update
- [ ] `npm run test:prod` passes
- [ ] `npm run build:vite` succeeds
- [ ] Commit `package.json` and `package-lock.json` together
