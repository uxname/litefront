import { AccountPage } from "@pages/account";
import { createFileRoute } from "@tanstack/react-router";

interface AccountSearch {
  /** Set by Logto Account Center on a successful action (via `show_success`). */
  show_success?: boolean;
}

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
  component: () => <AccountPage showSuccess={Route.useSearch().show_success} />,
});
