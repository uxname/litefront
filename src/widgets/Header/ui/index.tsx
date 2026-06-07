import { useAuth } from "@features/auth";
import { LocaleSwitcher } from "@features/locale";
import { ThemeToggle } from "@features/theme";
import { m } from "@generated/paraglide/messages";
import { captureMessage } from "@shared/lib/sentry";
import { Link } from "@tanstack/react-router";
import {
  ChevronDown,
  Loader2,
  LogIn,
  LogOut,
  Settings,
  User,
} from "lucide-react";
import { FC, useCallback } from "react";

interface HeaderProps {
  /** Title of the current page, shown next to the brand. */
  title?: string;
}

export const Header: FC<HeaderProps> = ({ title }) => {
  const auth = useAuth();

  const handleSignIn = useCallback(() => {
    // Remember the current location so the post-login callback returns here.
    void auth.signinRedirect({
      state: { returnTo: window.location.pathname + window.location.search },
    });
  }, [auth]);

  const handleSignOut = useCallback(() => {
    captureMessage("Auth: sign-out initiated", { level: "info" });
    void auth.signoutRedirect();
  }, [auth]);

  return (
    <nav className="flex w-full items-center justify-between gap-4">
      <div className="flex min-w-0 items-center gap-3">
        <Link
          to="/"
          aria-label="LiteFront — home"
          className="flex shrink-0 items-center gap-2 rounded-lg transition-opacity hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary font-black text-primary-content shadow-sm">
            L
          </span>
          <span className="hidden text-lg font-bold tracking-tight text-base-content sm:block">
            LiteFront
          </span>
        </Link>

        {title && (
          <>
            <span
              className="h-5 w-px shrink-0 bg-base-300"
              aria-hidden="true"
            />
            <span className="truncate text-sm font-semibold text-base-content">
              {title}
            </span>
          </>
        )}
      </div>

      <div className="flex items-center gap-1.5">
        <LocaleSwitcher />
        <ThemeToggle />

        {auth.isLoading ? (
          <div className="flex items-center gap-2 rounded-full bg-base-200 px-3 py-1.5 text-base-content/70">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="hidden text-xs font-medium sm:inline">
              {m.auth_verifying()}
            </span>
          </div>
        ) : auth.isAuthenticated ? (
          <details className="dropdown dropdown-end">
            <summary
              aria-haspopup="menu"
              aria-label={m.profile_settings_title()}
              className="flex cursor-pointer list-none items-center gap-2 rounded-full border border-base-300 bg-base-200 px-3 py-1.5 transition-colors hover:bg-base-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary [&::-webkit-details-marker]:hidden"
            >
              <span className="rounded-full bg-base-100 p-0.5 shadow-sm">
                <User className="h-3 w-3 text-base-content/70" />
              </span>
              <span className="max-w-[120px] truncate text-xs font-semibold text-base-content">
                {auth.user?.profile.email || "User"}
              </span>
              <ChevronDown className="h-3 w-3 text-base-content/70" />
            </summary>

            <ul className="dropdown-content menu z-[60] mt-2 w-56 rounded-xl border border-base-300 bg-base-100 p-1.5 shadow-lg">
              <li>
                <Link
                  to="/account"
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-base-content hover:bg-base-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                >
                  <Settings className="h-4 w-4 text-base-content/70" />
                  {m.profile_settings_title()}
                </Link>
              </li>
              <li>
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-error hover:bg-error/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-error"
                >
                  <LogOut className="h-4 w-4" />
                  {m.auth_logout()}
                </button>
              </li>
            </ul>
          </details>
        ) : (
          <button
            type="button"
            onClick={handleSignIn}
            className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-content shadow-sm transition-all hover:-translate-y-0.5 hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            <LogIn className="h-4 w-4" />
            {m.auth_sign_in()}
          </button>
        )}
      </div>
    </nav>
  );
};
