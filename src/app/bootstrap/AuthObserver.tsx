import { useAuth } from "@features/auth";
import { logError } from "@shared/lib/logger";
import { setUser } from "@shared/lib/sentry";
import { type FC, useEffect } from "react";

/**
 * Headless, client-only observability bridge between the auth layer and the
 * error sink.
 *
 * `react-oidc-context` surfaces auth failures through the hook's `error`
 * property and through `events` (silent-renew errors) — NOT by throwing — so the
 * window-level {@link GlobalErrorBoundary} never sees them. This component wires
 * those signals into `logError` (console always, Sentry when a DSN was baked in)
 * and keeps the Sentry user identity in sync.
 *
 * Mounted inside `AuthBoundary` (so `useAuth()` is available). On the server the
 * {@link NeutralAuthProvider} makes every branch a safe no-op (`user`/`error` are
 * `undefined`, the event registrars are stubs), so it renders nothing harmful
 * during SSR. Renders no markup.
 *
 * Previously lived in `main.tsx`'s `App` component; preserved here verbatim when
 * the SPA entry was replaced by the TanStack Start SSR provider tree.
 */
export const AuthObserver: FC = () => {
  const auth = useAuth();

  useEffect(() => {
    if (auth.error) {
      logError("auth_error", auth.error);
    }
  }, [auth.error]);

  useEffect(() => {
    if (!auth.events?.addSilentRenewError) return;
    const handler = (error: Error) => {
      logError("auth_silent_renew_failed", error);
    };
    auth.events.addSilentRenewError(handler);
    return () => {
      auth.events.removeSilentRenewError(handler);
    };
  }, [auth.events]);

  // The user and its tokens live in localStorage, shared by every tab. When
  // another tab signs out it removes them; drop this tab's in-memory copy too,
  // instead of calling the API with it until it expires.
  useEffect(() => {
    if (!auth.user) return;
    const onStorage = (e: StorageEvent) => {
      if (e.key?.startsWith("oidc.user:") && e.newValue === null) {
        void auth.removeUser();
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [auth.user, auth.removeUser]);

  useEffect(() => {
    if (auth.user) {
      // Identify by the opaque subject only — never send email/username PII to
      // Sentry. The `sub` is enough to correlate a user's events.
      setUser({ id: auth.user.profile.sub });
    } else {
      setUser(null);
    }
  }, [auth.user]);

  return null;
};
