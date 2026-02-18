import { useAuth } from "@features/auth";
import { toast } from "@shared/ui/Toaster";
import { useRouter } from "@tanstack/react-router";
import { Header } from "@widgets/Header";
import {
  Check,
  Copy,
  CreditCard,
  Fingerprint,
  Key,
  LogOut,
  Shield,
  ShieldCheck,
  Timer,
  User,
} from "lucide-react";
import { FC, useCallback, useState } from "react";

export const ProtectedPage: FC = () => {
  const auth = useAuth();
  const user = auth.user?.profile;
  const router = useRouter();
  const [isCopied, setIsCopied] = useState(false);

  const handleSignOut = useCallback(async () => {
    toast.info("Signing out...", { duration: 1000 });
    await new Promise((resolve) => setTimeout(resolve, 500)); // Fake delay for UX
    await auth.removeUser();
    router.invalidate();
  }, [auth, router]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    toast.success("ID copied to clipboard");
    setTimeout(() => setIsCopied(false), 2000);
  };

  // Calculate session health (mock calculation for visual)
  const expiresIn = auth.user?.expires_in || 0;
  const sessionHealth = Math.min((expiresIn / 3600) * 100, 100);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20 selection:bg-emerald-100 selection:text-emerald-900">
      {/* Background Decor */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[20%] w-[600px] h-[600px] bg-emerald-100/40 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-teal-100/40 rounded-full blur-[100px]" />
      </div>

      {/* Header */}
      <div className="sticky top-0 z-50 border-b border-white/20 bg-white/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Header />
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-bold border border-emerald-100 uppercase tracking-wide">
              <ShieldCheck className="w-3.5 h-3.5" />
              Secure Environment
            </div>
          </div>
        </div>
      </div>

      <main className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Page Header */}
        <div className="mb-12 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-slate-900 mb-2">
              Identity Dashboard
            </h1>
            <p className="text-slate-500 max-w-xl">
              You are accessing a protected route. Below are your session
              details verified by the OIDC provider.
            </p>
          </div>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 text-red-600 font-semibold rounded-xl hover:bg-red-50 hover:border-red-100 transition-all shadow-sm hover:shadow-md active:scale-95"
          >
            <LogOut className="w-4 h-4" />
            End Session
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Digital ID Card */}
          <div className="lg:col-span-5 space-y-6">
            <div className="relative group perspective-1000">
              <div className="relative overflow-hidden rounded-2xl bg-linear-to-br from-slate-900 to-slate-800 text-white shadow-2xl p-8 transition-transform duration-500 group-hover:scale-[1.02] group-hover:rotate-x-2">
                {/* Decorative Patterns */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none"></div>

                <div className="relative z-10 flex flex-col h-full justify-between min-h-[220px]">
                  <div className="flex justify-between items-start">
                    <div className="p-3 bg-white/10 backdrop-blur-md rounded-xl border border-white/10">
                      <Fingerprint className="w-8 h-8 text-emerald-400" />
                    </div>
                    <div className="text-right">
                      <span className="block text-xs font-bold text-slate-400 uppercase tracking-widest">
                        Status
                      </span>
                      <span className="inline-flex items-center gap-1.5 text-emerald-400 font-bold text-sm bg-emerald-500/10 px-2 py-0.5 rounded">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                        VERIFIED
                      </span>
                    </div>
                  </div>

                  <div className="mt-8">
                    <p className="text-slate-400 text-xs uppercase tracking-widest mb-1">
                      Identity Subject
                    </p>
                    <h2 className="text-2xl font-mono font-bold tracking-tight truncate">
                      {user?.email || "Unknown User"}
                    </h2>
                    <button
                      type="button"
                      className="flex items-center gap-2 mt-2 text-slate-400 hover:text-white transition-colors cursor-pointer w-fit bg-transparent border-none p-0"
                      onClick={() => copyToClipboard(user?.sub || "")}
                    >
                      <code className="text-xs bg-black/30 px-2 py-1 rounded border border-white/10 font-mono truncate max-w-[200px] sm:max-w-xs">
                        {user?.sub}
                      </code>
                      {isCopied ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Session Stats */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                  <Timer className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">Session Health</h3>
                  <p className="text-xs text-slate-500">
                    Token validity period
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between text-sm font-medium">
                  <span className="text-slate-500">Time Remaining</span>
                  <span className="text-slate-900 tabular-nums">
                    {expiresIn}s
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                  <div
                    className="bg-indigo-600 h-2.5 rounded-full transition-all duration-1000 ease-linear"
                    style={{ width: `${sessionHealth}%` }}
                  ></div>
                </div>
                <p className="text-xs text-slate-400 mt-2">
                  The session will automatically renew silently in background
                  before expiration.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Claims Inspector */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm h-full flex flex-col overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-slate-400" />
                  <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wide">
                    Token Claims
                  </h3>
                </div>
                <span className="text-xs font-mono text-slate-400 bg-white border border-slate-200 px-2 py-1 rounded">
                  ReadOnly
                </span>
              </div>

              <div className="p-0 flex-1 relative bg-slate-50/30 overflow-auto max-h-[500px] custom-scrollbar">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 text-xs font-bold text-slate-400 uppercase tracking-wider">
                      <th className="px-6 py-3 bg-slate-50 w-1/3">Claim Key</th>
                      <th className="px-6 py-3 bg-slate-50">Value</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm">
                    {Object.entries(user || {}).map(([key, value]) => (
                      <tr
                        key={key}
                        className="hover:bg-white transition-colors group"
                      >
                        <td className="px-6 py-3.5 font-mono text-indigo-600 font-medium bg-slate-50/50 group-hover:bg-white">
                          {key}
                        </td>
                        <td className="px-6 py-3.5 text-slate-600 font-mono break-all">
                          {typeof value === "object"
                            ? JSON.stringify(value)
                            : String(value)}
                        </td>
                      </tr>
                    ))}
                    {/* Fake Access Level Claim for UI Demo */}
                    <tr className="hover:bg-white transition-colors group">
                      <td className="px-6 py-3.5 font-mono text-indigo-600 font-medium bg-slate-50/50 group-hover:bg-white">
                        access_level
                      </td>
                      <td className="px-6 py-3.5">
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-medium bg-emerald-100 text-emerald-800 border border-emerald-200">
                          <Shield className="w-3 h-3" />
                          granted
                        </span>
                      </td>
                    </tr>
                    <tr className="hover:bg-white transition-colors group">
                      <td className="px-6 py-3.5 font-mono text-indigo-600 font-medium bg-slate-50/50 group-hover:bg-white">
                        auth_method
                      </td>
                      <td className="px-6 py-3.5">
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
                          <Key className="w-3 h-3" />
                          oidc_pkce
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="px-6 py-3 border-t border-slate-100 bg-slate-50 text-xs text-slate-400 text-center">
                Sensitive information. Do not share screenshots of this panel.
              </div>
            </div>
          </div>
        </div>

        {/* Security Badges */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "TLS Encryption", status: "Active" },
            { label: "OIDC Protocol", status: "Verified" },
            { label: "PKCE Flow", status: "Enforced" },
            { label: "Auth Guard", status: "Enabled" },
          ].map((item) => (
            <div
              key={item.label}
              className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-xl shadow-sm opacity-60 hover:opacity-100 transition-opacity"
            >
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                <span className="text-sm font-medium text-slate-600">
                  {item.label}
                </span>
              </div>
              <User className="w-4 h-4 text-slate-300" />
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};
