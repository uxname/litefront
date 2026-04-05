---
name: refactor-fsd
description: Use this skill to move code between FSD layers, safely rename a slice, or completely delete an FSD module (feature, entity, widget). Trigger phrases: "migrate fsd", "move to feature", "rename slice", "delete entity", "remove feature", "refactor layer".
version: 1.0.0
---

# Refactor FSD Slice

Safely moves, renames, or deletes code within the FSD architecture.

**CRITICAL SAFETY RULE:** NEVER move, rename, or delete any file or folder without FIRST running a workspace-wide text search (grep) to find all its consumers.

## 1. Move (Layer Migration)

Moves code between FSD layers without breaking imports or boundaries.

### Why This Is Risky

Moving between layers (e.g., `entities/` → `features/`) means:
1. Import paths change everywhere the slice is used
2. The slice may now be allowed to import things it couldn't before
3. Downstream slices may become invalid (if they imported from a layer now "below" them)

### Steps

#### 1. Identify all usages

Use your workspace search tools / file reading capabilities to find all exact string matches for the old import path (e.g., `"@entities/counter"` or `"/entities/counter"`). Do not proceed until you have a complete list of consumers.

#### 2. Create the new slice location

Create the full structure at the new layer path (see `new-fsd-slice` skill for structure).

#### 3. Copy and adjust

- Copy all files from old location to new location
- Update internal imports within the slice (e.g., relative paths stay the same)
- Update the `index.ts` as needed

#### 4. Update all consumers

For each file that imported from the old location, update the import path:

```ts
// Before
import { Counter } from "@entities/counter";

// After (if moved to features)
import { Counter } from "@features/counter";
```

#### 5. Delete old slice

Remove the old directory only after all imports are updated.

#### 6. Verify

```bash
npm run lint:fsd    # Boundary checks
npm run ts:check    # No broken imports
npm run lint        # No dead imports
npm run knip        # No unused exports
```

### Layer Promotion Patterns

#### entity → feature

When an entity starts managing user interactions or depends on other entities:

- **Allowed after**: can now import from other `@entities/*`
- **Check**: does anything in `features/` import your old entity? Those imports stay valid if the new feature exports the same API.

#### feature → widget

When a feature becomes a complex composite UI:

- **Allowed after**: can now import from `@features/*`

#### shared/ui → entities (anti-pattern)

Avoid moving generic UI components into entities — keep `shared/ui` for reusable primitives.

## 2. Rename Slice

Safely renames a slice (directory) and updates all references.

### Steps to Rename

1. Find all exact string matches for the old import path (e.g., `"@entities/old-name"`).
2. Rename the directory `src/<layer>/old-name` to `src/<layer>/new-name`.
3. Update all internal imports and the `index.ts` export names if necessary.
4. Update the import paths in all consumer files found in Step 1.

### Verify

```bash
npm run ts:check    # No broken imports
npm run knip        # No unused exports
```

## 3. Delete Slice

Safely removes a slice from the project.

### Steps to Delete safely

1. Search for all usages of the slice (e.g., `"@features/cart"`).
2. Remove the component/logic from the consumer files. You may need to ask the user how to handle the UI gap (e.g., "Should I remove the Cart button entirely?").
3. Delete the slice directory.
4. Run `npm run knip` to ensure no dead code is left behind in other parts of the app that depended on this slice.

### Verify

```bash
npm run ts:check    # No broken imports
npm run knip        # No dead code left behind
```

## Checklist

- [ ] All usages found via grep
- [ ] Operation (Move/Rename/Delete) completed
- [ ] All consumer imports updated (for Move/Rename)
- [ ] Old slice deleted (for Move/Delete)
- [ ] `npm run lint:fsd` passes
- [ ] `npm run ts:check` passes
- [ ] `npm run knip` shows no leftover dead exports
