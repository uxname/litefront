import { useAuth } from "@shared/auth";
import { Header } from "@widgets/Header";
import {
  CheckCircle2,
  Clock,
  Fingerprint,
  LogOut,
  Mail,
  ShieldCheck,
  User,
} from "lucide-react";
import type { FC } from "react";

export const ProtectedPage: FC = () => {
  const auth = useAuth();
  const user = auth.user?.profile;

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20">
      <div className="bg-white/90 backdrop-blur border-b border-slate-200 sticky top-0 z-40 py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-14 items-center justify-between">
            <Header />

            <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-medium border border-emerald-100">
              <ShieldCheck className="w-3.5 h-3.5" />
              Secure Session Active
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8 text-center sm:text-left">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Account Overview
          </h1>
          <p className="mt-2 text-slate-500">
            Manage your session and view identity details provided by the OIDC
            provider.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="relative bg-gradient-to-r from-emerald-50 to-teal-50 p-8 border-b border-slate-100">
            <div className="flex flex-col sm:flex-row items-center gap-6 relative z-10">
              <div className="w-20 h-20 rounded-full bg-white p-1 shadow-sm ring-4 ring-emerald-100/50">
                <div className="w-full h-full rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                  <User className="w-10 h-10" />
                </div>
              </div>

              <div className="text-center sm:text-left space-y-1">
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <h2 className="text-2xl font-bold text-slate-900">
                    {user?.email?.split("@")[0] ?? "User"}
                  </h2>
                  <ShieldCheck
                    className="w-5 h-5 text-emerald-500"
                    fill="currentColor"
                    fillOpacity={0.2}
                  />
                </div>
                <p className="text-slate-500 font-medium">{user?.email}</p>
                <div className="flex items-center justify-center sm:justify-start gap-1.5 text-xs text-emerald-600 font-semibold bg-white/60 w-fit mx-auto sm:mx-0 px-2 py-0.5 rounded-md mt-2">
                  <CheckCircle2 className="w-3 h-3" />
                  Authenticated
                </div>
              </div>
            </div>

            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-400/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
          </div>

          <div className="p-8">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-6">
              Session Details
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 hover:border-slate-200 transition-colors group">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-blue-50 text-blue-600 rounded-lg group-hover:bg-blue-100 transition-colors">
                    <Mail className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-medium text-slate-600">
                    Email Address
                  </span>
                </div>
                <div className="pl-11 font-mono text-sm text-slate-900 break-all">
                  {user?.email}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 hover:border-slate-200 transition-colors group">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-purple-50 text-purple-600 rounded-lg group-hover:bg-purple-100 transition-colors">
                    <Fingerprint className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-medium text-slate-600">
                    Subject ID
                  </span>
                </div>
                <div className="pl-11 font-mono text-xs text-slate-900 break-all">
                  {user?.sub}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 hover:border-slate-200 transition-colors group md:col-span-2">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-orange-50 text-orange-600 rounded-lg group-hover:bg-orange-100 transition-colors">
                    <Clock className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-medium text-slate-600">
                    Token Expiration
                  </span>
                </div>
                <div className="pl-11 flex items-center gap-2">
                  <span className="text-2xl font-bold text-slate-900 tabular-nums">
                    {auth.user?.expires_in}
                  </span>
                  <span className="text-sm text-slate-500">
                    seconds remaining
                  </span>
                </div>
                <div className="mt-3 pl-11">
                  <progress
                    className="progress progress-primary w-full h-1.5 opacity-50"
                    value={auth.user?.expires_in}
                    max="3600"
                  ></progress>
                </div>
              </div>
            </div>
          </div>

          <div className="px-8 py-6 bg-slate-50 border-t border-slate-200 flex justify-between items-center">
            <span className="text-xs text-slate-400 font-medium">
              Session secured via OIDC
            </span>
            <button
              onClick={() => void auth.removeUser()}
              className="btn btn-sm h-10 px-6 bg-white border-slate-200 text-red-600 hover:bg-red-50 hover:border-red-200 hover:text-red-700 shadow-sm normal-case font-medium"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};
