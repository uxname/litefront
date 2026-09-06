import { useAuth } from "@features/auth";
import { LocaleSwitcher } from "@features/locale";
import { ThemeToggle } from "@features/theme";
import { m } from "@generated/paraglide/messages";
import { captureMessage } from "@shared/lib/sentry";
import { Button } from "@shared/ui/Button";
import { Link } from "@tanstack/react-router";
import { ChevronDown, LogIn, LogOut, Settings, User } from "lucide-react";
import { FC, useCallback } from "react";

/**
 * Right-hand control cluster of the {@link Header}: locale switcher, theme
 * toggle, and the auth-dependent area (profile dropdown / sign-in button).
 *
 * Auth state drives only two branches: authenticated → profile, otherwise →
 * sign-in. The transient `isLoading` state intentionally renders the sign-in
 * (logged-out) markup so the first client paint matches the server's
 * unauthenticated SSR render — avoiding a hydration mismatch (the server uses
 * NeutralAuthProvider; the real OIDC context resolves after hydration).
 */
export const HeaderControls: FC = () => {
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
    <div className="flex items-center gap-1.5">
      <LocaleSwitcher />
      <ThemeToggle />

      {auth.isAuthenticated ? (
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
        <Button
          size="sm"
          onClick={handleSignIn}
          className="shadow-sm hover:-translate-y-0.5"
          leftIcon={<LogIn className="h-4 w-4" />}
        >
          {m.auth_sign_in()}
        </Button>
      )}
    </div>
  );
};
