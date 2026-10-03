import { signOut, useAuth } from "@features/auth";
import { LocaleSwitcher } from "@features/locale";
import { ThemeToggle } from "@features/theme";
import { m } from "@generated/paraglide/messages";
import { captureMessage } from "@shared/lib/sentry";
import { Avatar, AvatarFallback, AvatarImage } from "@shared/ui/avatar";
import { Button } from "@shared/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@shared/ui/dropdown-menu";
import { Link } from "@tanstack/react-router";
import { ChevronDown, LogIn, LogOut, Settings, User } from "lucide-react";
import { FC } from "react";

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

  // Plain functions on purpose: `auth` is a new object on every context change,
  // so useCallback(…, [auth]) never reused anything — and the React Compiler
  // (vite.config.ts) memoizes handlers on its own.
  const handleSignIn = () => {
    // Remember the current location so the post-login callback returns here.
    void auth.signinRedirect({
      state: { returnTo: window.location.pathname + window.location.search },
    });
  };

  const handleSignOut = () => {
    captureMessage("Auth: sign-out initiated", { level: "info" });
    void signOut(auth);
  };

  const email = auth.user?.profile.email;

  return (
    <div className="flex items-center gap-1.5">
      <LocaleSwitcher />
      <ThemeToggle />

      {auth.isAuthenticated ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="rounded-full pl-1"
              aria-label={m.profile_settings_title()}
            >
              <Avatar className="size-6">
                <AvatarImage src={auth.user?.profile.picture} alt="" />
                <AvatarFallback>
                  <User className="size-3 text-muted-foreground" />
                </AvatarFallback>
              </Avatar>
              <span className="max-w-30 truncate text-xs font-semibold">
                {email || m.profile_fallback_name()}
              </span>
              <ChevronDown className="size-3 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem asChild>
              <Link to="/account">
                <Settings />
                {m.profile_settings_title()}
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive" onSelect={handleSignOut}>
              <LogOut />
              {m.auth_logout()}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        // While auth is still loading a signed-in user briefly sees this button
        // too: the server renders signed-out (NeutralAuthProvider), and the
        // first client paint must match it or hydration fails.
        <Button size="sm" onClick={handleSignIn}>
          <LogIn />
          {m.auth_sign_in()}
        </Button>
      )}
    </div>
  );
};
