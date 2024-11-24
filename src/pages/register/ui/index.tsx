import { FC, useEffect } from "react";
import { useAuthStore } from "@shared/auth-store/lib/auth.store.ts";
import { LayoutAuth } from "@shared/layout-auth";
import { useNavigate } from "@tanstack/react-router";

import { RegisterForm } from "./register-form";
import { RegisterSidebar } from "./register-sidebar";

export const RegisterPage: FC = () => {
  const authStore = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (authStore.accessToken) {
      navigate({ to: "/", replace: true });
    }
  }, [authStore.accessToken, navigate]);

  return (
    <LayoutAuth
      firstPanelChildren={<RegisterForm />}
      secondPanelChildren={<RegisterSidebar />}
    />
  );
};
