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

export const Header: FC = () => {
  const auth = useAuth();

  const handleSignOut = useCallback(() => {
    captureMessage("Auth: sign-out initiated", { level: "info" });
    void auth.signoutRedirect();
  }, [auth]);

  return (
    <nav className="flex w-full items-center justify-between">
      <div className="flex items-center gap-8">
        <Link
          to="/"
          className="flex items-center gap-2 transition-opacity hover:opacity-80"
        >
          <span className="font-bold text-lg tracking-tight text-base-content hidden sm:block">
            LiteFront
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-6">
          <Link
            to="/"
            className="text-sm font-medium text-base-content/60 hover:text-base-content transition-colors [&.active]:text-primary [&.active]:font-semibold"
          >
            {m.nav_home()}
          </Link>
          <Link
            to="/protected"
            className="text-sm font-medium text-base-content/60 hover:text-base-content transition-colors [&.active]:text-primary [&.active]:font-semibold"
          >
            {m.nav_protected()}
          </Link>
        </div>
      </div>

      <div className="flex items-center gap-1.5">
        <LocaleSwitcher />
        <ThemeToggle />

        {auth.isLoading ? (
          <div className="flex items-center gap-2 text-base-content/60 px-3 py-1.5 bg-base-200 rounded-full">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-xs font-medium">{m.auth_verifying()}</span>
          </div>
        ) : auth.isAuthenticated ? (
          <details className="dropdown dropdown-end">
            <summary className="flex items-center gap-2 px-3 py-1.5 bg-base-200 rounded-full border border-base-300 transition-colors hover:bg-base-300 cursor-pointer list-none [&::-webkit-details-marker]:hidden">
              <span className="p-0.5 bg-base-100 rounded-full shadow-sm">
                <User className="h-3 w-3 text-base-content/60" />
              </span>
              <span className="text-xs font-semibold text-base-content max-w-[120px] truncate">
                {auth.user?.profile.email || "User"}
              </span>
              <ChevronDown className="h-3 w-3 text-base-content/60" />
            </summary>

            <ul className="dropdown-content menu z-[60] mt-2 w-56 rounded-xl border border-base-300 bg-base-100 p-1.5 shadow-lg">
              <li>
                <Link
                  to="/protected/account"
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-base-content hover:bg-base-200"
                >
                  <Settings className="h-4 w-4 text-base-content/60" />
                  {m.profile_settings_title()}
                </Link>
              </li>
              <li>
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-error hover:bg-error/10"
                >
                  <LogOut className="h-4 w-4" />
                  {m.auth_logout()}
                </button>
              </li>
            </ul>
          </details>
        ) : (
          <button
            onClick={() => void auth.signinRedirect()}
            className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-primary-content text-sm font-medium rounded-lg shadow-sm transition-all hover:-translate-y-0.5"
          >
            <LogIn className="h-4 w-4" />
            {m.auth_sign_in()}
          </button>
        )}
      </div>
    </nav>
  );
};
