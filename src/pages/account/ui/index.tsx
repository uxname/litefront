import {
  type AccountAction,
  buildAccountCenterUrl,
  useAuth,
} from "@features/auth";
import { m } from "@generated/paraglide/messages";
import { Link } from "@tanstack/react-router";
import { Header } from "@widgets/Header";
import {
  ArrowLeft,
  AtSign,
  ChevronRight,
  Fingerprint,
  Lock,
  type LucideIcon,
  Mail,
  ShieldCheck,
  Smartphone,
} from "lucide-react";
import { FC } from "react";

interface AccountActionItem {
  action: AccountAction;
  title: string;
  description: string;
  icon: LucideIcon;
  primary?: boolean;
}

export const AccountPage: FC = () => {
  const auth = useAuth();
  const user = auth.user?.profile;

  // Logto manages all credentials — we navigate to its hosted, step-up-verified
  // pages rather than building credential forms in this app.
  const openAccountCenter = (action: AccountAction) => {
    window.location.assign(buildAccountCenterUrl(action));
  };

  const securityActions: AccountActionItem[] = [
    {
      action: "password",
      title: m.change_password(),
      description: m.change_password_desc(),
      icon: Lock,
      primary: true,
    },
    {
      action: "authenticator-app",
      title: m.manage_mfa(),
      description: m.manage_mfa_desc(),
      icon: Smartphone,
    },
    {
      action: "passkey/add",
      title: m.manage_passkey(),
      description: m.manage_passkey_desc(),
      icon: Fingerprint,
    },
  ];

  const profileActions: AccountActionItem[] = [
    {
      action: "email",
      title: m.change_email(),
      description: m.change_email_desc(),
      icon: Mail,
    },
    {
      action: "username",
      title: m.change_username(),
      description: m.change_username_desc(),
      icon: AtSign,
    },
  ];

  const renderSection = (heading: string, items: AccountActionItem[]) => (
    <section className="space-y-3">
      <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400">
        {heading}
      </h2>
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm divide-y divide-slate-100">
        {items.map(({ action, title, description, icon: Icon, primary }) => (
          <button
            key={action}
            type="button"
            onClick={() => openAccountCenter(action)}
            className="group flex w-full items-center gap-4 px-5 py-4 text-left transition-colors hover:bg-slate-50 active:bg-slate-100"
          >
            <span
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${
                primary
                  ? "border-indigo-100 bg-indigo-50 text-indigo-600"
                  : "border-slate-200 bg-slate-50 text-slate-500"
              }`}
            >
              <Icon className="h-5 w-5" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-semibold text-slate-900">
                {title}
              </span>
              <span className="block truncate text-sm text-slate-500">
                {description}
              </span>
            </span>
            <ChevronRight className="h-4 w-4 shrink-0 text-slate-300 transition-transform group-hover:translate-x-0.5 group-hover:text-slate-500" />
          </button>
        ))}
      </div>
    </section>
  );

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20 selection:bg-indigo-100 selection:text-indigo-900">
      {/* Background Decor */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[20%] w-[600px] h-[600px] bg-indigo-100/40 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-100/40 rounded-full blur-[100px]" />
      </div>

      {/* Header */}
      <div className="sticky top-0 z-50 border-b border-white/20 bg-white/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Header />
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-bold border border-indigo-100 uppercase tracking-wide">
              <ShieldCheck className="w-3.5 h-3.5" />
              {m.account_security()}
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
            {m.account_title()}
          </h1>
          <p className="max-w-xl text-slate-500">{m.account_subtitle()}</p>
          {user?.email && (
            <p className="mt-3 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-sm font-medium text-slate-600">
              <Mail className="h-3.5 w-3.5 text-slate-400" />
              {user.email}
            </p>
          )}
        </div>

        <div className="space-y-8">
          {renderSection(m.account_security(), securityActions)}
          {renderSection(m.account_profile(), profileActions)}
        </div>
      </main>
    </div>
  );
};
