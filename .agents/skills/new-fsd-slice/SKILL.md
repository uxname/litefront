---
name: new-fsd-slice
description: Use this skill when the user asks to create a new FSD slice, add a new feature, entity, widget, or shared module, or when scaffolding any new architectural unit in the project. Trigger phrases: "new feature", "new entity", "new widget", "new fsd slice", "scaffold slice".
version: 1.0.0
---

# New FSD Slice

Scaffolds a new Feature-Sliced Design slice following the project conventions.

## Layer Rules

| Layer | Path | Can import from |
|---|---|---|
| `app` | `src/app/` | any |
| `pages` | `src/pages/` | features, widgets, entities, shared |
| `features` | `src/features/` | entities, shared |
| `widgets` | `src/widgets/` | features, entities, shared |
| `entities` | `src/entities/` | shared only |
| `shared` | `src/shared/` | nothing internal |

**Violations are caught by Steiger (`npm run lint:fsd`). Always run it after creating a slice.**

## Standard Slice Structure

```
src/<layer>/<slice-name>/
├── index.ts          # Public API — only export what other layers need
├── ui/               # React components
│   └── SliceName.tsx
├── model/            # Business logic: stores, types, hooks
│   ├── store.ts      # Zustand store (if stateful)
│   └── types.ts
└── api/              # Data fetching (GraphQL hooks, urql)
    └── queries.ts
```

Not every slice needs all folders — include only what's relevant.

## Checklist

1. Create the slice directory under the correct layer
2. Add `index.ts` with explicit named exports
3. Use path aliases in imports: `@shared/*`, `@entities/*`, `@features/*`, `@widgets/*`, `@pages/*`
4. No default exports — use named exports only
5. Run `npm run lint:fsd` to verify boundaries
6. Run `npm run ts:check` to verify types
7. Write the slice's tests **first** (see below), then make `npm run check` and `npm run test:cov` pass

## index.ts Pattern

```ts
// src/features/auth/index.ts
export { AuthGuard } from "./ui/AuthGuard";
export { useAuthStore } from "./model/store";
export type { AuthUser } from "./model/types";
```

If the slice requires state management, use the `new-store` skill to generate a Zustand store in the `model/` folder.

## After Creating

Always run:
```bash
npm run lint:fsd   # Check FSD boundaries
npm run ts:check   # Check types
```

## Tests (required — write them first)

Every slice ships tests, and they come **before** the implementation (TDD): encode the contract as failing assertions, then build the slice to green. Stores, hooks, and pure `model/`/util functions get unit tests; UI components in `ui/` get a component test — and a `shared/ui` component additionally needs a Ladle story (the story+test+component "trio"). Tests are non-optional: `npm run check` runs the suite and `npm run test:cov` enforces the coverage floors locally and in CI, so the slice is not done until both pass. Use the `write-tests` skill for the patterns.

## Adding to an Existing Slice

If the user asks to add a component/hook to an **existing** slice (e.g., add a `CartItem` to `entities/cart`), do not recreate the slice.
1. Locate the slice directory.
2. Add the file to the appropriate folder (e.g., `ui/CartItem.tsx`).
3. Export it from the slice's `index.ts` public API if it needs to be accessed by higher layers.
