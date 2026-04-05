---
name: remove-fsd-module
description: Use this skill when the user asks to delete code, remove a component, delete a slice, or clean up unused files. Trigger phrases: "delete component", "remove slice", "delete code", "cleanup unused", "remove-fsd-module".
version: 1.0.0
---

# Remove FSD Module

Safely removes a module from the project while ensuring no broken imports remain.

## When NOT to Use

- If the user wants to delete temporary files (logs, cache, build artifacts) — just delete them manually.
- If the user wants to delete test files — use `write-tests` skill to handle properly.

## Process

### Step 1: Find all imports

Search for all imports of the module being removed:

```bash
# Search for imports of the module
grep -r "from.*<module-name>" --include="*.ts" --include="*.tsx" src/
grep -r "import.*<module-name>" --include="*.ts" --include="*.tsx" src/
```

Common import patterns:
- Named import: `import { Foo } from "@features/foo"`
- Default import: `import Foo from "@features/foo"`
- Namespace: `import * as foo from "@features/foo"`

### Step 2: Analyze consumers

For each file that imports the module:
- If the import is used — remove or replace with alternative
- If the import is unused — just remove the import statement

### Step 3: Remove the module

Delete the module directory and its files:

```bash
rm -rf src/features/foo/
# or
rm src/shared/ui/Button/Button.tsx
```

### Step 4: Clean up barrel exports

If the module was exported from a parent `index.ts`, remove the export:

```ts
// Before
export { Foo } from "./foo/Foo";

// After (remove the line)
```

### Step 5: Verify no broken references

Run these checks:

```bash
npm run ts:check      # TypeScript will error on broken imports
npm run knip          # Will report unused exports
npm run lint:fsd      # Verify FSD boundaries
```

### Step 6: Commit the cleanup

Stage and commit the removals:

```bash
git add -A
git commit -m "refactor: remove unused <module-name>"
```

## Checklist

- [ ] All imports found and cleaned up
- [ ] Module files deleted
- [ ] Barrel exports removed
- [ ] `npm run ts:check` passes
- [ ] `npm run knip` passes
- [ ] `npm run lint:fsd` passes
- [ ] Changes committed
