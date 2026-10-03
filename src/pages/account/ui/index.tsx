import { buildAccountCenterUrl, useAuth } from "@features/auth";
import { ProfileForm } from "@features/profile";
import { MeDocument } from "@generated/graphql";
import { m } from "@generated/paraglide/messages";
import { logError } from "@shared/lib/logger";
import { Alert, AlertDescription, AlertTitle } from "@shared/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@shared/ui/avatar";
import { Badge } from "@shared/ui/badge";
import { Button } from "@shared/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@shared/ui/card";
import { PageLoader } from "@shared/ui/page-loader";
import { Skeleton } from "@shared/ui/skeleton";
import { toast } from "@shared/ui/sonner";
import { Tooltip, TooltipContent, TooltipTrigger } from "@shared/ui/tooltip";
import { Link, useNavigate } from "@tanstack/react-router";
import { AppShell } from "@widgets/AppShell";
import {
  AlertCircle,
  ArrowLeft,
  BadgeCheck,
  ChevronRight,
  Mail,
  User as UserIcon,
} from "lucide-react";
import { type FC, useEffect } from "react";
import { useQuery } from "urql";
import {
  buildSecurityActions,
  formatMemberSince,
  resolveAvatarUrl,
  resolveDisplayName,
  resolveEmail,
  resolveEmailVerified,
  roleLabel,
} from "../lib/account";

interface AccountPageProps {
  /** Set by Logto Account Center on a successful action (via `show_success`). */
  showSuccess?: boolean;
}

/**
 * The page's auth gate. It lives here and not in `src/routes/account.tsx`
 * because route files are not an FSD layer and no gate checks them, so logic
 * put there is logic nothing reviews.
 *
 * The gate wraps rather than merges: AccountView must not mount — and must not
 * fire its `me` query — until the user is actually authenticated.
 */
export const AccountPage: FC<AccountPageProps> = ({ showSuccess }) => {
  const auth = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (showSuccess) {
      toast.success(m.change_password_success());
      // Drop the one-shot flag so a refresh doesn't re-trigger the toast.
      void navigate({ to: "/account", search: {}, replace: true });
    }
  }, [showSuccess, navigate]);

  // Client-side auth gate. The route is `ssr: false`, so the guard runs only in
  // the browser where the real OIDC context is live. (Previously this lived in
  // `beforeLoad` via router context; the router no longer carries auth.)
  useEffect(() => {
    if (auth.isLoading || auth.isAuthenticated) return;
    let cancelled = false;
    void (async () => {
      try {
        // Kick off sign-in, remembering where the user was headed so the callback
        // returns them here. `returnTo` is consumed by `history.replace()` in
        // AppProviders, which takes a router path — an absolute URL would be
        // parsed as the pathname itself and land on a 404. Same shape as
        // HeaderControls.
        await auth.signinRedirect({
          state: {
            returnTo: window.location.pathname + window.location.search,
          },
        });
      } catch (error) {
        // The IdP being unreachable must not strand the user on the loader
        // forever: report it and fall back to a page they can actually use.
        logError("signin_redirect_failed", error, {
          tags: { flow: "account-signin-redirect" },
        });
        if (!cancelled) {
          toast.error(m.error_unexpected());
          void navigate({ to: "/" });
        }
        return;
      }
      // Fallback for the mock-auth provider (signinRedirect is a no-op there):
      // send the user home instead of leaving them on a blocked page.
      if (!cancelled) void navigate({ to: "/" });
    })();
    return () => {
      cancelled = true;
    };
  }, [auth.isLoading, auth.isAuthenticated, auth.signinRedirect, navigate]);

  if (auth.isLoading || !auth.isAuthenticated) {
    return <PageLoader label={m.common_loading()} />;
  }

  return <AccountView />;
};

const AccountView: FC = () => {
  const auth = useAuth();
  const claims = auth.user?.profile;
  const [{ data, fetching, error }, refetchMe] = useQuery({
    query: MeDocument,
  });
  const me = data?.me;

  const securityActions = buildSecurityActions();

  const avatarUrl = resolveAvatarUrl(me, claims);
  const displayName = resolveDisplayName(me, claims);
  const email = resolveEmail(claims);
  const emailVerified = resolveEmailVerified(claims);
  const memberSince = formatMemberSince(me?.createdAt);

  return (
    <AppShell>
      <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 lg:px-8">
        <Link
          to="/"
          className="mb-8 inline-flex items-center gap-1.5 rounded-md text-sm font-medium text-muted-foreground outline-none transition-colors hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50"
        >
          <ArrowLeft className="size-4" />
          {m.back_to_home()}
        </Link>

        <div className="mb-10">
          <h1 className="mb-2 text-3xl font-black tracking-tight">
            {m.profile_settings_title()}
          </h1>
          <p className="max-w-xl text-muted-foreground">
            {m.profile_settings_subtitle()}
          </p>
        </div>

        <div className="space-y-8">
          {/* Identity */}
          {fetching && !me ? (
            <Card aria-busy="true">
              <CardContent className="flex items-center gap-4">
                <span role="status" className="sr-only">
                  {m.common_loading()}
                </span>
                <Skeleton className="size-16 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-2/5" />
                  <Skeleton className="h-4 w-3/5" />
                </div>
              </CardContent>
            </Card>
          ) : error ? (
            <Alert variant="destructive">
              <AlertCircle />
              <AlertTitle>{m.profile_load_error()}</AlertTitle>
              <AlertDescription>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2"
                  onClick={() => refetchMe({ requestPolicy: "network-only" })}
                >
                  {m.action_retry()}
                </Button>
              </AlertDescription>
            </Alert>
          ) : (
            <Card>
              <CardContent className="flex items-start gap-4">
                <Avatar className="size-16 border">
                  <AvatarImage
                    src={avatarUrl ?? undefined}
                    alt={displayName ?? ""}
                  />
                  <AvatarFallback>
                    <UserIcon className="size-7 text-muted-foreground" />
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-lg font-bold">
                    {displayName ?? m.profile_user_id()}
                  </p>
                  {email && (
                    <p className="mt-0.5 flex min-w-0 items-center gap-1.5 text-sm text-muted-foreground">
                      <Mail className="size-3.5 shrink-0" aria-hidden="true" />
                      <span className="truncate">{email}</span>
                      {emailVerified && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <BadgeCheck
                              className="size-3.5 shrink-0 text-success"
                              role="img"
                              aria-label={m.profile_email_verified()}
                            />
                          </TooltipTrigger>
                          <TooltipContent>
                            {m.profile_email_verified()}
                          </TooltipContent>
                        </Tooltip>
                      )}
                    </p>
                  )}
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    {me?.roles?.map((role) => (
                      <Badge key={role} variant="secondary">
                        {roleLabel(role)}
                      </Badge>
                    ))}
                    {memberSince && (
                      <span className="text-xs text-muted-foreground">
                        {m.profile_member_since({ date: memberSince })}
                      </span>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Edit profile (backend-managed fields) */}
          {me ? (
            <Card>
              <CardHeader className="border-b">
                <CardTitle>{m.profile_edit_section()}</CardTitle>
              </CardHeader>
              <CardContent>
                <ProfileForm
                  profile={me}
                  accessToken={auth.user?.access_token}
                />
              </CardContent>
            </Card>
          ) : (
            !fetching &&
            !error && (
              <p className="text-sm text-muted-foreground">
                {m.profile_empty()}
              </p>
            )
          )}

          {/* Account & security (Logto-managed). Real links: the identity
              provider is another site, and a link can be opened in a new tab. */}
          <Card className="gap-0 pb-0">
            <CardHeader className="border-b">
              <CardTitle>{m.profile_security_section()}</CardTitle>
            </CardHeader>
            <ul className="divide-y">
              {securityActions.map(({ action, title, icon: Icon }) => (
                <li key={action}>
                  <a
                    href={buildAccountCenterUrl(action)}
                    className="group flex w-full items-center gap-4 px-6 py-4 outline-none transition-colors hover:bg-accent focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:ring-inset"
                  >
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-xl border bg-muted text-muted-foreground">
                      <Icon className="size-5" aria-hidden="true" />
                    </span>
                    <span className="flex-1 text-sm font-semibold">
                      {title}
                    </span>
                    <ChevronRight
                      className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5"
                      aria-hidden="true"
                    />
                  </a>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>
    </AppShell>
  );
};
