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

### 4. Look at the page (agents can't see a browser)

After the route renders, capture it and **read the PNG** to confirm the layout
and that it works in dark mode:

```bash
npm run test:e2e:screens
```

Add your route to the matrix in `tests/e2e/agent-screens.spec.ts` (or temporarily),
then read `test-results/screenshots/<route>-cmyk-desktop.png` and
`<route>-dark-desktop.png` with the Read tool. If the dark shot looks light, you
used hardcoded Tailwind colors instead of daisyUI tokens — fix and re-capture.
See [docs/DEBUGGING.md](../../../docs/DEBUGGING.md).

## Protected Page

If the new page requires authentication, **DO NOT** write auth logic manually. After creating the basic route structure, immediately invoke the `add-auth-guard` skill to protect the route properly.

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

## Tests (required — write them first)

Tests are non-optional and machine-enforced (`npm run test:cov` enforces coverage
floors locally and in CI). Keep the page UI thin and push any non-trivial logic —
selectors, fallback/derive helpers, query-param parsing — into the page's `lib/`,
then test that logic **test-first**: write the failing unit assertions that encode
its contract before implementing to green. Cover the route itself with an E2E spec
in `tests/e2e/` for its happy path (and any redirect/loader/error states). Use the
`write-tests` skill for patterns.

## Checklist

- [ ] Route file created in `src/routes/`
- [ ] Page component created in `src/pages/<name>/`
- [ ] `index.ts` with named exports
- [ ] `npm run gen:routes` executed
- [ ] If protected: `AuthGuard` added or `beforeLoad` redirect (see `add-auth-guard` skill)
- [ ] If data-fetching: `loader` + `pendingComponent` + `errorComponent` added
- [ ] Captured + read the page screenshot in both themes (`npm run test:e2e:screens`)
- [ ] Tests written first: unit tests for extracted `lib/` logic + an E2E spec in `tests/e2e/` for the route; `npm run check` and `npm run test:cov` pass
- [ ] `npm run ts:check` passes
