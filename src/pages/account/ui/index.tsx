import { buildAccountCenterUrl, useAuth } from "@features/auth";
import { ProfileForm } from "@features/profile";
import { MeDocument } from "@generated/graphql";
import { m } from "@generated/paraglide/messages";
import { logError } from "@shared/lib/logger";
import { Button } from "@shared/ui/Button";
import { Card } from "@shared/ui/Card";
import { PageLoader } from "@shared/ui/PageLoader";
import { Skeleton } from "@shared/ui/Skeleton";
import { toast } from "@shared/ui/Toaster";
import { Link, useNavigate } from "@tanstack/react-router";
import { Header } from "@widgets/Header";
import {
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
    return <PageLoader />;
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
    <div className="min-h-screen bg-base-200 font-sans text-base-content pb-20 selection:bg-primary/10 selection:text-primary">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[20%] w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-info/10 rounded-full blur-[100px]" />
      </div>

      <div className="sticky top-0 z-50 border-b border-base-300/60 bg-base-100/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center">
            <Header title={m.profile_settings_title()} />
          </div>
        </div>
      </div>

      <main className="relative z-10 max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link
          to="/"
          className="mb-8 inline-flex items-center gap-1.5 rounded-md text-sm font-medium text-base-content/70 transition-colors hover:text-base-content focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          <ArrowLeft className="h-4 w-4" />
          {m.back_to_home()}
        </Link>

        <div className="mb-10">
          <h1 className="text-3xl font-black tracking-tight text-base-content mb-2">
            {m.profile_settings_title()}
          </h1>
          <p className="max-w-xl text-base-content/70">
            {m.profile_settings_subtitle()}
          </p>
        </div>

        <div className="space-y-8">
          {/* Identity */}
          {fetching && !me ? (
            <Card>
              <div className="flex items-center gap-4">
                <Skeleton variant="circle" width={64} height={64} />
                <div className="flex-1 space-y-2">
                  <Skeleton width="40%" />
                  <Skeleton width="60%" />
                </div>
              </div>
            </Card>
          ) : error ? (
            <Card>
              <div className="flex flex-col items-start gap-3">
                <p className="text-sm text-error">{m.profile_load_error()}</p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => refetchMe({ requestPolicy: "network-only" })}
                >
                  {m.action_retry()}
                </Button>
              </div>
            </Card>
          ) : (
            <Card>
              <div className="flex items-start gap-4">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt={displayName ?? ""}
                    className="h-16 w-16 shrink-0 rounded-full border border-base-300 object-cover"
                  />
                ) : (
                  <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border border-base-300 bg-base-200 text-base-content/70">
                    <UserIcon className="h-7 w-7" />
                  </span>
                )}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-lg font-bold text-base-content">
                    {displayName ?? m.profile_user_id()}
                  </p>
                  {email && (
                    <p className="mt-0.5 flex items-center gap-1.5 truncate text-sm text-base-content/70">
                      <Mail className="h-3.5 w-3.5 shrink-0 text-base-content/70" />
                      {email}
                      {emailVerified && (
                        <BadgeCheck className="h-3.5 w-3.5 shrink-0 text-success" />
                      )}
                    </p>
                  )}
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    {me?.roles?.map((role) => (
                      <span
                        key={role}
                        className="inline-flex items-center rounded-full bg-base-200 px-2.5 py-0.5 text-xs font-semibold text-base-content/70"
                      >
                        {roleLabel(role)}
                      </span>
                    ))}
                    {memberSince && (
                      <span className="text-xs text-base-content/70">
                        {m.profile_member_since()} {memberSince}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* Edit profile (backend-managed fields) */}
          {me && (
            <Card title={m.profile_edit_section()}>
              <ProfileForm profile={me} accessToken={auth.user?.access_token} />
            </Card>
          )}

          {/* Account & security (Logto-managed) */}
          <Card title={m.profile_security_section()} bodyClassName="p-0">
            <ul className="divide-y divide-base-300">
              {securityActions.map(({ action, title, icon: Icon }) => (
                <li key={action}>
                  <button
                    type="button"
                    onClick={() =>
                      window.location.assign(buildAccountCenterUrl(action))
                    }
                    className="group flex w-full items-center gap-4 px-5 py-4 text-left transition-colors hover:bg-base-200 active:bg-base-300 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary"
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-base-300 bg-base-200 text-base-content/70">
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="flex-1 text-sm font-semibold text-base-content">
                      {title}
                    </span>
                    <ChevronRight className="h-4 w-4 shrink-0 text-base-content/70 transition-transform group-hover:translate-x-0.5 group-hover:text-base-content/70" />
                  </button>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </main>
    </div>
  );
};
