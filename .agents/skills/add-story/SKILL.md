---
name: add-story
description: Use this skill when the user asks to add a Ladle story, create a storybook story, document a component visually, or add component examples. Trigger phrases: "добавь story", "ladle story", "storybook", "задокументируй компонент", "add story", "create story", "component story".
version: 1.0.0
---

# Add Ladle Story

Adds a visual story for a component using Ladle (the project's Storybook alternative).

## Story File Location

Stories live alongside the component they document:

```
src/shared/ui/Button/
├── Button.tsx
├── Button.stories.tsx   ← here
└── index.ts

src/features/auth/ui/
├── LoginForm.tsx
├── LoginForm.stories.tsx   ← here
```

**File naming: `ComponentName.stories.tsx`**

## Basic Story Template

```tsx
// Button.stories.tsx
import type { Story } from "@ladle/react";
import { Button } from "./Button";

// Simple story
export const Default: Story = () => <Button>Click me</Button>;

// Story with args (interactive controls)
export const WithControls: Story<{ label: string; disabled: boolean }> = ({
  label,
  disabled,
}) => <Button disabled={disabled}>{label}</Button>;

WithControls.args = {
  label: "Button",
  disabled: false,
};
```

## Story with Context (Auth, Router)

For components that need providers (router context, auth state):

```tsx
import type { Story } from "@ladle/react";
import { createMemoryHistory, createRouter, RouterProvider } from "@tanstack/react-router";
import { routeTree } from "@generated/routeTree.gen";
import { Header } from "./Header";

const router = createRouter({ routeTree, history: createMemoryHistory() });

export const Default: Story = () => (
  <RouterProvider router={router}>
    <Header />
  </RouterProvider>
);
```

## Story with Multiple Variants

```tsx
import type { Story } from "@ladle/react";
import { Badge } from "./Badge";

export const Success: Story = () => <Badge variant="success">Active</Badge>;
export const Warning: Story = () => <Badge variant="warning">Pending</Badge>;
export const Error: Story = () => <Badge variant="error">Failed</Badge>;
export const Info: Story = () => <Badge variant="info">Draft</Badge>;
```

## Running Ladle

```bash
npm run storybook:serve     # Dev server at http://localhost:61000
npm run storybook:build     # Build static output
npm run storybook:preview   # Preview static build
```

## Checklist

- [ ] Story file named `ComponentName.stories.tsx`
- [ ] Lives in the same directory as the component
- [ ] Each meaningful variant has its own exported story
- [ ] Stories render without errors (`npm run storybook:serve`)
- [ ] If the component needs providers, wrap them in the story
