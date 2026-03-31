---
name: new-component
description: Use this skill when the user asks to create a new reusable UI component, shared UI element, or design system component. Trigger phrases: "new component", "new ui component", "create component", "add to shared/ui".
version: 1.0.0
---

# New Shared UI Component

Creates a reusable component in `shared/ui/` with a Ladle story and optional test.

## When to Use shared/ui vs Other Layers

- `shared/ui/` — generic, reusable, no domain logic (Button, Modal, Card, Badge)
- `entities/<name>/ui/` — domain-specific component tied to one entity (UserAvatar, ProductCard)
- `features/<name>/ui/` — interactive feature component (LoginForm, AddToCartButton)

## Structure

```
src/shared/ui/
└── ComponentName/
    ├── ComponentName.tsx       # Component implementation
    ├── ComponentName.stories.tsx  # Ladle story
    ├── ComponentName.test.tsx  # Vitest component test (optional)
    └── index.ts                # Named export
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

```tsx
// src/shared/ui/Button/Button.stories.tsx
import type { Story } from "@ladle/react";
import { Button } from "./Button";

export const Primary: Story = () => (
  <Button variant="primary">Primary Button</Button>
);

export const Secondary: Story = () => (
  <Button variant="secondary">Secondary Button</Button>
);

export const Ghost: Story = () => (
  <Button variant="ghost">Ghost Button</Button>
);
```

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

## Checklist

- [ ] Component in `src/shared/ui/<ComponentName>/`
- [ ] Props typed with explicit interface
- [ ] Named export (no default exports)
- [ ] `index.ts` created
- [ ] Ladle story added with main variants
- [ ] Component test added if logic is non-trivial
- [ ] Run `npm run storybook:serve` to verify story renders
