---
name: new-page
description: Use this skill when the user asks to create a new page, add a new route, or add a new screen to the application. Trigger phrases: "new page", "new route", "add route".
version: 1.0.0
---

# New Page

Creates a new page with a TanStack Router route following the project's file-based routing.

## Route File Location

TanStack Router uses file-based routing. Route files live in `src/routes/`:

```
src/routes/
├── __root.tsx          # Root layout (do not edit for new pages)
├── index.tsx           # / (home)
├── callback.tsx        # /callback (OAuth)
└── protected/
    └── index.tsx       # /protected
```

**After creating any route file, always run `npm run gen:routes` to regenerate `src/generated/routeTree.gen.ts`.**

## Steps

### 1. Create the route file

```ts
// src/routes/about.tsx
import { createFileRoute } from "@tanstack/react-router";
import { AboutPage } from "@pages/about";

export const Route = createFileRoute("/about")({
  component: AboutPage,
});
```

### 2. Create the page component

```
src/pages/about/
├── index.ts
└── ui/
    └── AboutPage.tsx
```

```tsx
// src/pages/about/ui/AboutPage.tsx
export function AboutPage() {
  return (
    <div>
      <h1>About</h1>
    </div>
  );
}
```

```ts
// src/pages/about/index.ts
export { AboutPage } from "./ui/AboutPage";
```

### 3. Regenerate route tree

```bash
npm run gen:routes
```

This updates `src/generated/routeTree.gen.ts`. **Never edit this file manually.**

## Protected Page

For pages that require authentication, wrap with `AuthGuard`:

```tsx
// src/routes/dashboard.tsx
import { createFileRoute } from "@tanstack/react-router";
import { AuthGuard } from "@features/auth";
import { DashboardPage } from "@pages/dashboard";

export const Route = createFileRoute("/dashboard")({
  component: () => (
    <AuthGuard>
      <DashboardPage />
    </AuthGuard>
  ),
});
```

## Nested Routes

For `/settings/profile` style routes:

```
src/routes/settings/
├── index.tsx        # /settings
└── profile.tsx      # /settings/profile
```

## Route with Data Loading

TanStack Router supports `loader` for data fetching before the component renders:

```tsx
// src/routes/users/$userId.tsx
import { createFileRoute } from "@tanstack/react-router";
import { UserPage } from "@pages/users";

export const Route = createFileRoute("/users/$userId")({
  loader: async ({ params }) => {
    const user = await fetchUser(params.userId);
    return { user };
  },
  pendingComponent: () => <div>Loading...</div>,
  errorComponent: ({ error }) => <div>Error: {error.message}</div>,
  component: UserPage,
});
```

Access loader data in the page component:

```tsx
// src/pages/users/ui/UserPage.tsx
import { Route } from "@routes/users/$userId";

export function UserPage() {
  const { user } = Route.useLoaderData();
  return <div>{user.name}</div>;
}
```

## Checklist

- [ ] Route file created in `src/routes/`
- [ ] Page component created in `src/pages/<name>/`
- [ ] `index.ts` with named exports
- [ ] `npm run gen:routes` executed
- [ ] If protected: `AuthGuard` added or `beforeLoad` redirect (see `add-auth-guard` skill)
- [ ] If data-fetching: `loader` + `pendingComponent` + `errorComponent` added
- [ ] `npm run ts:check` passes
