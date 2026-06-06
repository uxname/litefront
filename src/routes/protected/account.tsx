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

export const Route = createFileRoute("/protected/account")({
  validateSearch: (search: Record<string, unknown>): AccountSearch =>
    // Only carry the flag when truthy so the URL stays clean otherwise.
    search.show_success === true || search.show_success === "true"
      ? { show_success: true }
      : {},
  beforeLoad: ({ context }) => {
    if (!context.auth.isAuthenticated) {
      throw redirect({
        to: "/",
      });
    }
  },
  head: () => ({
    meta: [
      {
        title: "Account Settings | LiteFront",
      },
      {
        name: "description",
        content: "Manage your account identity and security settings.",
      },
      {
        name: "robots",
        content: "noindex, nofollow",
      },
    ],
  }),
  component: AccountRoute,
});
