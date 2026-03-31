---
name: add-auth-guard
description: Use this skill when the user asks to protect a route, add authentication to a page, restrict access to authenticated users, or work with OIDC/OAuth auth context. Trigger phrases: "protect route", "auth guard", "restricted page", "protected route".
version: 1.0.0
---

# Add Auth Guard

Protects routes so only authenticated users can access them. Uses OIDC via `react-oidc-context`.

## How Auth Works in This Project

- Authentication is OIDC/OAuth 2.0 via Logto (or any compatible provider)
- `react-oidc-context` provides `useAuth()` hook and `AuthProvider`
- `AuthGuard` component (in `src/features/auth/`) handles redirect logic
- The `/callback` route handles the OAuth redirect after login

## Protecting a Route

### Option 1: beforeLoad redirect (preferred — route-level, no flicker)

```tsx
// src/routes/dashboard.tsx
import { createFileRoute, redirect } from "@tanstack/react-router";
import { DashboardPage } from "@pages/dashboard";

export const Route = createFileRoute("/dashboard")({
  beforeLoad: ({ context }) => {
    // context.auth is injected via router context — see src/app/router.tsx
    if (!context.auth?.isAuthenticated) {
      throw redirect({ to: "/" });
    }
  },
  component: DashboardPage,
});
```

### Option 2: AuthGuard component wrapper (simpler, shows loading state)

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

Use Option 1 when you want instant redirects with no flash of protected content.
Use Option 2 when the component itself handles loading states gracefully.

### Option 3: Use auth state inside a component

```tsx
import { useAuth } from "react-oidc-context";

function ProfilePage() {
  const auth = useAuth();

  if (auth.isLoading) return <div>Loading...</div>;
  if (!auth.isAuthenticated) return <div>Please sign in</div>;

  return <div>Hello, {auth.user?.profile.name}</div>;
}
```

## AuthGuard Behavior

`AuthGuard` automatically:
- Checks if the user is authenticated
- Redirects to the OIDC login page if not authenticated (using `auth.signinRedirect()`)
- Shows a loading state while authentication is being checked
- Passes auth context to children once authenticated

## Accessing User Data

```tsx
import { useAuth } from "react-oidc-context";

function UserAvatar() {
  const { user } = useAuth();

  return (
    <img
      src={user?.profile.picture}
      alt={user?.profile.name ?? "User"}
    />
  );
}
```

Available from `user.profile`:
- `user.profile.sub` — unique user ID
- `user.profile.name` — display name
- `user.profile.email` — email
- `user.profile.picture` — avatar URL
- `user.access_token` — Bearer token (auto-added to GraphQL requests)

## Sign In / Sign Out

```tsx
import { useAuth } from "react-oidc-context";

function AuthButtons() {
  const auth = useAuth();

  return auth.isAuthenticated ? (
    <button onClick={() => auth.signoutRedirect()}>Sign Out</button>
  ) : (
    <button onClick={() => auth.signinRedirect()}>Sign In</button>
  );
}
```

## Environment Variables

For auth to work, these must be set in `.env`:

```
VITE_OIDC_AUTHORITY=https://your-idp.com/oidc
VITE_OIDC_CLIENT_ID=your-client-id
VITE_OIDC_REDIRECT_URI=http://localhost:3000/callback
VITE_OIDC_SCOPE=openid profile offline_access
```

## Checklist

- [ ] Route uses `AuthGuard` wrapper or `useAuth()` check
- [ ] Route file regenerated with `npm run gen:routes` if new route created
- [ ] Environment variables set in `.env`
- [ ] Sign-out calls `auth.signoutRedirect()` (not just clearing state)
