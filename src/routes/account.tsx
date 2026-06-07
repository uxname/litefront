import { m } from "@generated/paraglide/messages";
import { AccountPage } from "@pages/account";
import { toast } from "@shared/ui/Toaster";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { useEffect } from "react";

interface AccountSearch {
  /** Set by Logto Account Center on a successful action (via `show_success`). */
  show_success?: boolean;
}

const AccountRoute = () => {
  const { show_success } = Route.useSearch();
  const navigate = Route.useNavigate();

  useEffect(() => {
    if (show_success) {
      toast.success(m.change_password_success());
      // Drop the one-shot flag so a refresh doesn't re-trigger the toast.
      void navigate({ search: {}, replace: true });
    }
  }, [show_success, navigate]);

  return <AccountPage />;
};

export const Route = createFileRoute("/account")({
  validateSearch: (search: Record<string, unknown>): AccountSearch =>
    // Only carry the flag when truthy so the URL stays clean otherwise.
    search.show_success === true || search.show_success === "true"
      ? { show_success: true }
      : {},
  beforeLoad: async ({ context, location }) => {
    if (!context.auth.isAuthenticated) {
      // Kick off sign-in and remember where the user was headed so the
      // post-login callback can bring them right back here.
      await context.auth.signinRedirect({
        state: { returnTo: location.href },
      });
      // Fallback for the mock-auth provider (signinRedirect is a no-op there).
      throw redirect({ to: "/" });
    }
  },
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
