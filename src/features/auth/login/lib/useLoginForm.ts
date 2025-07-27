import { zodResolver } from "@hookform/resolvers/zod";
import { useAuthStore } from "@shared/auth-store/lib/auth.store.ts";
import { useNavigate } from "@tanstack/react-router";
import { useCallback, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import {
  getValidationSchema,
  ILoginFormValues,
} from "../model/validation-schema";

export const useLoginForm = () => {
  const { t } = useTranslation(["login"]);
  const authStore = useAuthStore();
  const navigate = useNavigate();

  const schema = useMemo(() => getValidationSchema(t), [t]);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ILoginFormValues>({
    resolver: zodResolver(schema),
  });

  const handleLogin = useCallback(
    async (data: ILoginFormValues) => {
      console.log("Logged in!", data);
      authStore.setAccessToken("fake-access-token");
      await navigate({ to: "/", replace: true });
    },
    [authStore, navigate],
  );

  return {
    t,
    control,
    errors,
    handleSubmit: handleSubmit(handleLogin),
  };
};
