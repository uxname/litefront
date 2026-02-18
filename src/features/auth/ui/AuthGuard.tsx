import { Navigate, useLocation } from "@tanstack/react-router";
import { FC, ReactNode } from "react";
import { useAuth } from "../api/oidc-client";

interface AuthGuardProps {
  children: ReactNode;
  fallback?: ReactNode;
  redirectTo?: string;
}

export const AuthGuard: FC<AuthGuardProps> = ({
  children,
  fallback,
  redirectTo = "/login",
}) => {
  const auth = useAuth();
  const location = useLocation();

  if (auth.isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (!auth.isAuthenticated) {
    if (fallback) {
      return <>{fallback}</>;
    }

    return (
      <Navigate to={redirectTo} search={{ from: location.pathname }} replace />
    );
  }

  return <>{children}</>;
};
