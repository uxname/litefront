---
name: new-fsd-slice
description: Use this skill when the user asks to create a new FSD slice, add a new feature, entity, widget, or shared module, or when scaffolding any new architectural unit in the project. Trigger phrases: "создай фичу", "добавь entity", "новый widget", "создай shared модуль", "new feature", "new entity", "new widget".
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

## index.ts Pattern

```ts
// src/features/auth/index.ts
export { AuthGuard } from "./ui/AuthGuard";
export { useAuthStore } from "./model/store";
export type { AuthUser } from "./model/types";
```

## Zustand Store Pattern (entities/features)

```ts
// model/store.ts
import { create } from "zustand";

interface CounterState {
  count: number;
  increment: () => void;
  decrement: () => void;
  reset: () => void;
}

export const useCounterStore = create<CounterState>((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
  reset: () => set({ count: 0 }),
}));
```

## After Creating

Always run:
```bash
npm run lint:fsd   # Check FSD boundaries
npm run ts:check   # Check types
```
