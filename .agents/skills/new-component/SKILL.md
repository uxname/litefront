---
name: new-component
description: Use this skill when the user asks to create a new reusable UI component, shared UI element, or design system component. Strictly for shared/ui layer. Trigger phrases: "new component", "new ui component", "create component", "add to shared/ui".
version: 1.0.0
---

# New Shared UI Component

Creates a reusable component in `shared/ui/` as a **trio**: implementation +
Ladle story + Vitest test. **The story and the test are mandatory** — the
`trio` check in `npm run check` (`scripts/check-component-trio.mjs`) fails the
build for any `src/shared/ui/<Name>/` missing `<Name>.stories.tsx` or
`<Name>.test.tsx`, and the same gate runs in CI. Write the test first (TDD):
encode the component's contract as failing assertions, then implement to green.

## When to Use shared/ui vs Other Layers

- `shared/ui/` — generic, reusable, no domain logic (Button, Modal, Card, Badge)
- `entities/<name>/ui/` — domain-specific component tied to one entity (UserAvatar, ProductCard)
- `features/<name>/ui/` — interactive feature component (LoginForm, AddToCartButton)

**CRITICAL:** This skill is **ONLY** for creating generic components in `src/shared/ui/`. If the user asks to add a component to a specific feature or entity, DO NOT use this skill. Instead, add the component to the existing slice's `ui/` folder or use `new-fsd-slice` if the slice doesn't exist.

## Structure

```
src/shared/ui/
└── ComponentName/
    ├── ComponentName.tsx       # Component implementation
    ├── ComponentName.stories.tsx  # Ladle story (REQUIRED — trio gate)
    ├── ComponentName.test.tsx  # Vitest component test (REQUIRED — trio gate)
    └── index.ts                # Named re-export (export * from "./ComponentName")
```

## Component Template

```tsx
// src/shared/ui/Button/Button.tsx
import type { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  children: ReactNode;
}

export function Button({
  variant = "primary",
  size = "md",
  children,
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`btn btn-${variant} btn-${size} ${className ?? ""}`}
      {...props}
    >
      {children}
    </button>
  );
}
```

## Ladle Story Template

Every new shared component MUST have a `.stories.tsx` file. To generate the correct Ladle story content and boilerplate, strictly use the `add-story` skill.

## Index Export

```ts
// src/shared/ui/Button/index.ts
export { Button } from "./Button";
export type { ButtonProps } from "./Button"; // only if type is needed outside
```

Also add to `src/shared/ui/index.ts` if a barrel exists:

```ts
export { Button } from "./Button";
```

## Styling Guidelines

- **Prefer Tailwind CSS v4 utilities** for layout, spacing, colors
- **Use daisyUI classes** (`btn`, `card`, `badge`, etc.) for semantic component styles
- **Use SCSS Modules** (`.module.scss`) only for complex scoped styles not achievable with Tailwind

## Verify it visually (agents can't see a browser)

`npm run storybook:serve` is for a human; an agent can't see it. To confirm the
component looks right **and reacts to dark mode**, capture a screenshot and read
the PNG. Most shared components appear on a real page (`/`, `/account`) — run the
screenshot harness and read where it renders:

```bash
npm run test:e2e:screens   # → test-results/screenshots/<route>-<theme>-*.png
```

For an off-page state (e.g. a loading or error variant not on any page), add a
temporary route that renders it, capture, read, then remove the throwaway. Compare
`*-cmyk-*` vs `*-dark-*`: identical-looking regions mean hardcoded colors instead
of daisyUI tokens. See [docs/DEBUGGING.md](../../../docs/DEBUGGING.md).

## Checklist

- [ ] Component in `src/shared/ui/<ComponentName>/`
- [ ] Props typed with explicit interface
- [ ] Named export (no default exports)
- [ ] `index.ts` created
- [ ] Ladle story added with main variants (**required** — trio gate)
- [ ] Vitest test added covering rendering, props/variants, and behaviour (**required** — trio gate; write it test-first)
- [ ] `npm run check` passes (runs the `trio` gate among biome/ts/knip/steiger)
- [ ] Verified visually in both themes (`npm run test:e2e:screens`, read the PNG)
