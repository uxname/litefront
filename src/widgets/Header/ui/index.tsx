import { useAuth } from "@features/auth";
import { Link, useRouter } from "@tanstack/react-router";
import { Loader2, LogIn, LogOut, User } from "lucide-react";
import { FC, useCallback } from "react";

export const Header: FC = () => {
  const auth = useAuth();
  const router = useRouter();

  const handleSignOut = useCallback(async () => {
    await auth.removeUser();
    router.invalidate();
  }, [auth, router]);

  return (
    <nav className="flex w-full items-center justify-between">
      <div className="flex items-center gap-8">
        <Link
          to="/"
          className="flex items-center gap-2 transition-opacity hover:opacity-80"
        >
          <span className="font-bold text-lg tracking-tight text-slate-900 hidden sm:block">
            LiteFront
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-6">
          <Link
            to="/"
            className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors [&.active]:text-indigo-600 [&.active]:font-semibold"
          >
            Home
          </Link>
          <Link
            to="/protected"
            className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors [&.active]:text-indigo-600 [&.active]:font-semibold"
          >
            Protected Area
          </Link>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {auth.isLoading ? (
          <div className="flex items-center gap-2 text-slate-400 px-3 py-1.5 bg-slate-50 rounded-full">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-xs font-medium">Verifying...</span>
          </div>
        ) : auth.isAuthenticated ? (
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-full border border-slate-200">
              <div className="p-0.5 bg-white rounded-full shadow-sm">
                <User className="h-3 w-3 text-slate-600" />
              </div>
              <span className="text-xs font-semibold text-slate-700 max-w-[120px] truncate">
                {auth.user?.profile.email || "User"}
              </span>
            </div>

            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
              title="Sign Out"
            >
              <span className="hidden sm:inline">Logout</span>
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => void auth.signinRedirect()}
            className="flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium rounded-lg shadow-sm shadow-slate-300 transition-all hover:-translate-y-0.5"
          >
            <LogIn className="h-4 w-4" />
            Sign In
          </button>
        )}
      </div>
    </nav>
  );
};
