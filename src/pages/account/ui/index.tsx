import {
  type AccountAction,
  buildAccountCenterUrl,
  useAuth,
} from "@features/auth";
import { ProfileForm } from "@features/profile";
import { useMeQuery } from "@generated/graphql";
import { m } from "@generated/paraglide/messages";
import { Button } from "@shared/ui/Button";
import { Card } from "@shared/ui/Card";
import { Skeleton } from "@shared/ui/Skeleton";
import { Link } from "@tanstack/react-router";
import { Header } from "@widgets/Header";
import {
  ArrowLeft,
  BadgeCheck,
  ChevronRight,
  KeyRound,
  Lock,
  type LucideIcon,
  Mail,
  ShieldCheck,
  Smartphone,
  User as UserIcon,
} from "lucide-react";
import { type FC } from "react";

interface SecurityAction {
  action: AccountAction;
  title: string;
  icon: LucideIcon;
}

export const AccountPage: FC = () => {
  const auth = useAuth();
  const claims = auth.user?.profile;
  const [{ data, fetching, error }, refetchMe] = useMeQuery();
  const me = data?.me;

  const securityActions: SecurityAction[] = [
    { action: "email", title: m.change_email(), icon: Mail },
    { action: "password", title: m.change_password(), icon: Lock },
    { action: "authenticator-app", title: m.manage_mfa(), icon: Smartphone },
    { action: "passkey/add", title: m.manage_passkey(), icon: KeyRound },
  ];

  const avatarUrl =
    me?.avatarUrl ??
    (typeof claims?.picture === "string" ? claims.picture : null);
  const displayName =
    me?.displayName ??
    (typeof claims?.name === "string" ? claims.name : undefined) ??
    (typeof claims?.email === "string" ? claims.email : undefined);
  const email = typeof claims?.email === "string" ? claims.email : undefined;
  const emailVerified =
    typeof claims?.email_verified === "boolean"
      ? claims.email_verified
      : undefined;
  const memberSince = me?.createdAt
    ? new Date(String(me.createdAt)).toLocaleDateString()
    : undefined;
  const roleLabel = (role: string) =>
    role === "ADMIN" ? m.role_admin() : m.role_user();

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20 selection:bg-indigo-100 selection:text-indigo-900">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[20%] w-[600px] h-[600px] bg-indigo-100/40 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-100/40 rounded-full blur-[100px]" />
      </div>

      <div className="sticky top-0 z-50 border-b border-white/20 bg-white/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Header />
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-bold border border-indigo-100 uppercase tracking-wide">
              <ShieldCheck className="w-3.5 h-3.5" />
              {m.profile_settings_title()}
            </div>
          </div>
        </div>
      </div>

      <main className="relative z-10 max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link
          to="/protected"
          className="mb-8 inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 transition-colors hover:text-slate-900"
        >
          <ArrowLeft className="h-4 w-4" />
          {m.account_back()}
        </Link>

        <div className="mb-10">
          <h1 className="text-3xl font-black tracking-tight text-slate-900 mb-2">
            {m.profile_settings_title()}
          </h1>
          <p className="max-w-xl text-slate-500">
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
                <p className="text-sm text-red-600">{m.profile_load_error()}</p>
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
                    className="h-16 w-16 shrink-0 rounded-full border border-slate-200 object-cover"
                  />
                ) : (
                  <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-400">
                    <UserIcon className="h-7 w-7" />
                  </span>
                )}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-lg font-bold text-slate-900">
                    {displayName ?? m.profile_user_id()}
                  </p>
                  {email && (
                    <p className="mt-0.5 flex items-center gap-1.5 truncate text-sm text-slate-500">
                      <Mail className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                      {email}
                      {emailVerified && (
                        <BadgeCheck className="h-3.5 w-3.5 shrink-0 text-emerald-500" />
                      )}
                    </p>
                  )}
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    {me?.roles?.map((role) => (
                      <span
                        key={role}
                        className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-600"
                      >
                        {roleLabel(role)}
                      </span>
                    ))}
                    {memberSince && (
                      <span className="text-xs text-slate-400">
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
            <ul className="divide-y divide-slate-100">
              {securityActions.map(({ action, title, icon: Icon }) => (
                <li key={action}>
                  <button
                    type="button"
                    onClick={() =>
                      window.location.assign(buildAccountCenterUrl(action))
                    }
                    className="group flex w-full items-center gap-4 px-5 py-4 text-left transition-colors hover:bg-slate-50 active:bg-slate-100"
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-500">
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="flex-1 text-sm font-semibold text-slate-900">
                      {title}
                    </span>
                    <ChevronRight className="h-4 w-4 shrink-0 text-slate-300 transition-transform group-hover:translate-x-0.5 group-hover:text-slate-500" />
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
