---
name: update-deps
description: Use this skill when the user asks to update dependencies, upgrade packages, update npm packages, or keep the project up to date. Trigger phrases: "update dependencies", "upgrade packages", "npm update", "update npm".
version: 1.1.0
---

# Update Dependencies

Updates project dependencies using the project's interactive update workflow.

## Selective Update (Safer)

Always prefer updating specific packages one by one using `npx ncu -u <package_name>` to prevent breaking the build.

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

## Bulk Update (Use with extreme caution)

**DO NOT EXECUTE THIS AUTOMATICALLY.** If the user asks to "update dependencies", default to the **Selective Update** method. You may ONLY run `npm run update` if the user explicitly confirms it by saying exactly: "run full update" or "update all dependencies and ignore risks".

Run this ONLY if the user explicitly asks to update ALL dependencies unconditionally.

```bash
npm run update
```

This does:
1. `npx ncu -u` — bumps all versions in `package.json` to latest
2. `npx rimraf node_modules package-lock.json` — cleans old install
3. `npm install` — fresh install with new versions
4. `npm run lint:fix && npm run check` — auto-fix and verify (postinstall hook)

**This updates ALL dependencies at once.** It's aggressive — see selective update above for safer approach.

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

## Overrides

The project may use `overrides` in `package.json` to force specific transitive dependency versions (usually to fix security vulnerabilities that upstream packages haven't addressed yet).

### What are overrides?

`overrides` force npm to use a specific version of a transitive dependency regardless of what parent packages request. Example:

```json
{
  "overrides": {
    "lodash": "^4.17.24"
  }
}
```

### When to add overrides

- A transitive dependency has a known vulnerability
- The upstream package maintainer hasn't updated the dependency
- The fix is a patch version (low risk of breaking changes)

### When to remove overrides

After each `npm run update`, check if overrides are still needed:

1. Temporarily remove an override from `package.json`
2. Run `npm install`
3. Run `npm audit` — if the vulnerability disappears, the override is no longer needed
4. Run `npm run check` — make sure nothing broke
5. If clean, commit the removal

### Maintenance schedule

- **After every `npm run update`**: review overrides, remove obsolete ones
- **Monthly**: run `npm audit` and check if remaining overrides can be dropped
- **Quarterly**: audit all remaining overrides with `npm ls <package>` to see which parent still needs them

### Finding which override is still needed

```bash
# See which package depends on the overridden package
npm ls lodash
npm ls ws
npm ls minimatch
```

If no parent package requires the specific vulnerable version, the override is safe to remove.

## Checklist

- [ ] Preview changes with `npx ncu` before applying
- [ ] Check changelogs of high-risk packages
- [ ] `npm run check` passes after update
- [ ] `npm run test:prod` passes
- [ ] `npm run build:vite` succeeds
- [ ] Review and clean up `overrides` section
- [ ] Commit `package.json` and `package-lock.json` together
