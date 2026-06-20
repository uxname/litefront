---
name: add-auth-guard
description: Use this skill when the user asks to protect a route, add authentication to a page, restrict access to authenticated users, or work with OIDC/OAuth auth context. Trigger phrases: "protect route", "auth guard", "restricted page", "protected route".
version: 1.0.0
---

# Add Auth Guard

Protects routes so only authenticated users can access them. Uses OIDC via `react-oidc-context`.

## How Auth Works in This Project

- Authentication is OIDC/OAuth 2.0 via Logto (or any compatible provider)
- `react-oidc-context` provides the `useAuth()` hook
- The `/callback` route handles the OAuth redirect after login
- **This app is SSR (TanStack Start).** OIDC is browser-only, so on the server the
  app renders a neutral logged-out context (`NeutralAuthProvider`) and the real auth
  hydrates on the client. **Protected routes must be client-only** (`ssr: false`):
  there is no server session and no `context.auth` on the router — guard inside the
  component with `useAuth()`. Do **not** use `beforeLoad` + `context.auth` (removed).

## Protecting a Route

### Option 1: client-only route + in-component guard (preferred)

Mark the route `ssr: false` (auth is browser-only) and gate rendering with `useAuth()`.
This mirrors `src/routes/account.tsx`.

```tsx
// src/routes/dashboard.tsx
import { useAuth } from "@features/auth";
import { createFileRoute } from "@tanstack/react-router";
import { DashboardPage } from "@pages/dashboard";
import { PageLoader } from "@shared/ui/PageLoader";
import { useEffect } from "react";

const DashboardRoute = () => {
  const auth = useAuth();

  useEffect(() => {
    if (auth.isLoading || auth.isAuthenticated) return;
    void auth.signinRedirect({ state: { returnTo: window.location.href } });
  }, [auth.isLoading, auth.isAuthenticated, auth.signinRedirect]);

  if (auth.isLoading || !auth.isAuthenticated) return <PageLoader />;
  return <DashboardPage />;
};

export const Route = createFileRoute("/dashboard")({
  ssr: false, // auth is browser-only — never render this on the server
  component: DashboardRoute,
});
```

### Option 2: Read auth state inside any component

```tsx
import { useAuth } from "@features/auth";

function ProfilePage() {
  const auth = useAuth();

  if (auth.isLoading) return <div>Loading...</div>;
  if (!auth.isAuthenticated) return <div>Please sign in</div>;

  return <div>Hello, {auth.user?.profile.name}</div>;
}
```

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

- [ ] Protected route is `ssr: false` and guards with `useAuth()` in the component
- [ ] Route tree auto-regenerates on dev/build (no manual `gen:routes` step)
- [ ] Environment variables set in `.env`
- [ ] Sign-out calls `auth.signoutRedirect()` (not just clearing state)
