import { Link } from "@tanstack/react-router";
import { FC } from "react";
import { useAuth } from "react-oidc-context";

import logo from "../../../../.github/logo.svg";

export const Header: FC = () => {
  const auth = useAuth();

  return (
    <div className="container mx-auto px-4 py-4">
      <div className="flex flex-col items-center md:flex-row md:justify-between gap-4">
        <img src={logo} alt="logo" className="h-12 w-auto" />
        <nav className="flex flex-wrap justify-center gap-4 items-center">
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

          {auth.isLoading ? (
            <div className="loading loading-spinner loading-sm"></div>
          ) : auth.isAuthenticated ? (
            <div className="flex items-center gap-4">
              <span className="text-sm font-bold hidden sm:inline-block">
                {auth.user?.profile.email || auth.user?.profile.sub}
              </span>
              <button
                onClick={() => void auth.removeUser()} // Логаут
                className="btn btn-ghost text-error hover:bg-error/10 hover:text-error"
              >
                Logout
              </button>
            </div>
          ) : (
            <button
              onClick={() => void auth.signinRedirect()} // Логин (редирект на Logto)
              className="btn btn-ghost"
            >
              Login
            </button>
          )}
        </nav>
      </div>
      <div className="divider my-2"></div>
    </div>
  );
};
