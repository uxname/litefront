import { useAuthStore } from "@shared/auth-store/lib/auth.store.ts";
import { Link } from "@tanstack/react-router";
import { FC, useCallback } from "react";

import logo from "../../../../.github/logo.svg";

export const Header: FC = () => {
  const authStore = useAuthStore();
  const handleLogout = useCallback(async () => {
    // eslint-disable-next-line no-alert
    if (confirm("Are you sure you want to logout?")) {
      authStore.clear();
    }
  }, [authStore]);

  return (
    <div className="container mx-auto px-4 py-4">
      <div className="flex flex-col items-center md:flex-row md:justify-between gap-4">
        <img src={logo} alt="logo" className="h-12 w-auto" />
        <nav className="flex flex-wrap justify-center gap-4">
          <Link
            to="/"
            preload="intent"
            className="btn btn-ghost [&.active]:btn-active"
          >
            Home
          </Link>
          <Link
            to="/about"
            preload="intent"
            className="btn btn-ghost [&.active]:btn-active"
          >
            About
          </Link>
          {!authStore.accessToken && (
            <>
              <Link
                to="/login"
                preload="intent"
                className="btn btn-ghost [&.active]:btn-active"
              >
                Login
              </Link>
              <Link
                to="/register"
                preload="intent"
                className="btn btn-ghost [&.active]:btn-active"
              >
                Register
              </Link>
            </>
          )}
          {authStore.accessToken && (
            <button
              onClick={handleLogout}
              className="btn btn-ghost text-error hover:bg-error/10 hover:text-error"
            >
              Logout
            </button>
          )}
        </nav>
      </div>
      <div className="divider my-2"></div>
    </div>
  );
};
