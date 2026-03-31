---
name: new-store
description: Use this skill when the user asks to create a new Zustand store, add global state, add client state management, or create a state slice. Trigger phrases: "создай store", "добавь состояние", "zustand store", "глобальное состояние", "new store", "state management", "add state".
version: 1.0.0
---

# New Zustand Store

Creates a typed Zustand store following the project's patterns.

## Store Location

Stores live in the `model/` folder of their slice:

```
src/entities/counter/model/store.ts     # entity store
src/features/auth/model/store.ts        # feature store
```

Do NOT put stores in `shared/` — stores are domain-specific.

## Basic Store Pattern

```ts
// src/entities/<slice>/model/store.ts
import { create } from "zustand";

interface SliceState {
  // state fields
  value: string;
  isLoading: boolean;

  // actions
  setValue: (value: string) => void;
  reset: () => void;
}

const initialState = {
  value: "",
  isLoading: false,
};

export const useSliceStore = create<SliceState>((set) => ({
  ...initialState,

  setValue: (value) => set({ value }),
  reset: () => set(initialState),
}));
```

## Derived State (Selectors)

Use inline selectors in components to avoid unnecessary re-renders:

```tsx
// Good — component only re-renders when `value` changes
const value = useSliceStore((state) => state.value);

// Bad — re-renders on every store update
const store = useSliceStore();
```

For reusable selectors, export them from the store file:

```ts
export const selectIsLoading = (state: SliceState) => state.isLoading;

// Usage
const isLoading = useSliceStore(selectIsLoading);
```

## Async Actions

```ts
import { create } from "zustand";

interface DataState {
  items: Item[];
  isLoading: boolean;
  error: string | null;
  fetchItems: () => Promise<void>;
}

export const useDataStore = create<DataState>((set) => ({
  items: [],
  isLoading: false,
  error: null,

  fetchItems: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await api.getItems();
      set({ items: data, isLoading: false });
    } catch (err) {
      set({ error: String(err), isLoading: false });
    }
  },
}));
```

## Exporting from Slice

Always export through `index.ts`:

```ts
// src/entities/<slice>/index.ts
export { useSliceStore } from "./model/store";
export type { SliceState } from "./model/store"; // if needed externally
```

## Checklist

- [ ] Store created in `model/store.ts` of the correct slice
- [ ] Named export: `use<SliceName>Store`
- [ ] State and actions typed with an interface
- [ ] `initialState` extracted for easy reset
- [ ] Exported through slice `index.ts`
- [ ] No logic in `shared/` — stores are domain-specific
