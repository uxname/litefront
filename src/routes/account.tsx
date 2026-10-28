import { m } from "@generated/paraglide/messages";
import { AccountPage } from "@pages/account";
import { createFileRoute } from "@tanstack/react-router";

interface AccountSearch {
  /** Set by Logto Account Center on a successful action: the action's name or "true". */
  show_success?: string;
  /** The action our own return address names (buildAccountCenterUrl). */
  changed?: string;
}

const text = (v: unknown): string | undefined =>
  typeof v === "string" && v !== "" ? v : v === true ? "true" : undefined;

export const Route = createFileRoute("/account")({
  // Auth is browser-only (OIDC + window); never render this on the server.
  ssr: false,
  validateSearch: (search: Record<string, unknown>): AccountSearch => {
    // Only carry what is there, so the URL stays clean otherwise.
    const out: AccountSearch = {};
    const showSuccess = text(search.show_success);
    const changed = text(search.changed);
    if (showSuccess) out.show_success = showSuccess;
    if (changed) out.changed = changed;
    return out;
  },
  head: () => ({
    meta: [
      { title: m.meta_account_title() },
      { name: "description", content: m.meta_account_description() },
      {
        name: "robots",
        content: "noindex, nofollow",
      },
    ],
  }),
  component: () => {
    const { show_success, changed } = Route.useSearch();
    return <AccountPage showSuccess={show_success} changed={changed} />;
  },
});
