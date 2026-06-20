import { useAuth } from "@features/auth";
import { m } from "@generated/paraglide/messages";
import { AccountPage } from "@pages/account";
import { PageLoader } from "@shared/ui/PageLoader";
import { toast } from "@shared/ui/Toaster";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";

interface AccountSearch {
  /** Set by Logto Account Center on a successful action (via `show_success`). */
  show_success?: boolean;
}

const AccountRoute = () => {
  const auth = useAuth();
  const { show_success } = Route.useSearch();
  const navigate = Route.useNavigate();

  useEffect(() => {
    if (show_success) {
      toast.success(m.change_password_success());
      // Drop the one-shot flag so a refresh doesn't re-trigger the toast.
      void navigate({ search: {}, replace: true });
    }
  }, [show_success, navigate]);

  // Client-side auth gate. This route is `ssr: false`, so the guard runs only in
  // the browser where the real OIDC context is live. (Previously this lived in
  // `beforeLoad` via router context; the router no longer carries auth, so the
  // gate moved into the component.)
  useEffect(() => {
    if (auth.isLoading || auth.isAuthenticated) return;
    let cancelled = false;
    void (async () => {
      // Kick off sign-in, remembering where the user was headed so the callback
      // returns them here.
      await auth.signinRedirect({
        state: { returnTo: window.location.href },
      });
      // Fallback for the mock-auth provider (signinRedirect is a no-op there):
      // send the user home instead of leaving them on a blocked page.
      if (!cancelled) void navigate({ to: "/" });
    })();
    return () => {
      cancelled = true;
    };
  }, [auth.isLoading, auth.isAuthenticated, auth.signinRedirect, navigate]);

  if (auth.isLoading || !auth.isAuthenticated) {
    return <PageLoader />;
  }

  return <AccountPage />;
};

export const Route = createFileRoute("/account")({
  // Auth is browser-only (OIDC + window); never render this on the server.
  ssr: false,
  validateSearch: (search: Record<string, unknown>): AccountSearch =>
    // Only carry the flag when truthy so the URL stays clean otherwise.
    search.show_success === true || search.show_success === "true"
      ? { show_success: true }
      : {},
  head: () => ({
    meta: [
      {
        title: "Profile | LiteFront",
      },
      {
        name: "description",
        content: "Manage your profile, identity and security settings.",
      },
      {
        name: "robots",
        content: "noindex, nofollow",
      },
    ],
  }),
  component: AccountRoute,
});
