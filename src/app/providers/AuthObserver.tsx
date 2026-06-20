import { useAuth } from "@features/auth";
import { captureException, setUser } from "@shared/lib/sentry";
import { type FC, useEffect } from "react";

/**
 * Headless, client-only observability bridge between the auth layer and Sentry.
 *
 * `react-oidc-context` surfaces auth failures through the hook's `error`
 * property and through `events` (silent-renew errors) — NOT by throwing — so the
 * window-level {@link GlobalErrorBoundary} never sees them. This component wires
 * those signals into Sentry and keeps the Sentry user identity in sync.
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
      captureException(auth.error);
    }
  }, [auth.error]);

  useEffect(() => {
    if (!auth.events?.addSilentRenewError) return;
    const handler = (error: Error) => {
      captureException(error);
    };
    auth.events.addSilentRenewError(handler);
    return () => {
      auth.events.removeSilentRenewError(handler);
    };
  }, [auth.events]);

  useEffect(() => {
    if (auth.user) {
      setUser({
        id: auth.user.profile.sub,
        email: auth.user.profile.email,
        username: auth.user.profile.preferred_username,
      });
    } else {
      setUser(null);
    }
  }, [auth.user]);

  return null;
};
