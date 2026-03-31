---
name: migrate-fsd
description: Use this skill when the user asks to move code between FSD layers, refactor a module to a different layer, promote an entity to a feature, or reorganize the architecture. Trigger phrases: "migrate fsd", "move to feature", "promote entity", "refactor layer".
version: 1.0.0
---

# Migrate FSD Slice

Safely moves code between FSD layers without breaking imports or boundaries.

## Why This Is Risky

Moving between layers (e.g., `entities/` → `features/`) means:
1. Import paths change everywhere the slice is used
2. The slice may now be allowed to import things it couldn't before
3. Downstream slices may become invalid (if they imported from a layer now "below" them)

## Steps

### 1. Identify all usages

Before moving anything, find all import references:

```bash
# Replace "counter" with your slice name
grep -r "from.*entities/counter" src/ --include="*.ts" --include="*.tsx"
grep -r "@entities/counter" src/ --include="*.ts" --include="*.tsx"
```

### 2. Create the new slice location

Create the full structure at the new layer path (see `new-fsd-slice` skill for structure).

### 3. Copy and adjust

- Copy all files from old location to new location
- Update internal imports within the slice (e.g., relative paths stay the same)
- Update the `index.ts` as needed

### 4. Update all consumers

For each file that imported from the old location, update the import path:

```ts
// Before
import { Counter } from "@entities/counter";

// After (if moved to features)
import { Counter } from "@features/counter";
```

### 5. Delete old slice

Remove the old directory only after all imports are updated.

### 6. Verify

```bash
npm run lint:fsd    # Boundary checks
npm run ts:check    # No broken imports
npm run lint        # No dead imports
npm run knip        # No unused exports
```

## Layer Promotion Patterns

### entity → feature

When an entity starts managing user interactions or depends on other entities:

- **Allowed after**: can now import from other `@entities/*`
- **Check**: does anything in `features/` import your old entity? Those imports stay valid if the new feature exports the same API.

### feature → widget

When a feature becomes a complex composite UI:

- **Allowed after**: can now import from `@features/*`

### shared/ui → entities (anti-pattern)

Avoid moving generic UI components into entities — keep `shared/ui` for reusable primitives.

## Checklist

- [ ] All usages found via grep
- [ ] New slice created at target layer
- [ ] All consumer imports updated
- [ ] Old slice deleted
- [ ] `npm run lint:fsd` passes
- [ ] `npm run ts:check` passes
- [ ] `npm run knip` shows no leftover dead exports
