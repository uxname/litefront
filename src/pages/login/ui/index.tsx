import { FC, useEffect } from "react";
import { useAuthStore } from "@shared/auth-store/lib/auth.store.ts";
import { LayoutAuth } from "@shared/layout-auth";
import { useNavigate } from "@tanstack/react-router";

import { LoginForm } from "./login-form";
import { LoginSidebar } from "./login-sidebar";

export const LoginPage: FC = () => {
  const authStore = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (authStore.accessToken) {
      navigate({ to: "/", replace: true });
    }
  }, [authStore.accessToken, navigate]);

  return (
    <LayoutAuth
      firstPanelChildren={<LoginForm />}
      secondPanelChildren={<LoginSidebar />}
    />
  );
};
