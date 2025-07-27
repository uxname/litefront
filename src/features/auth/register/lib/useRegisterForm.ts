import { zodResolver } from "@hookform/resolvers/zod";
import { useAuthStore } from "@shared/auth-store/lib/auth.store.ts";
import { useNavigate } from "@tanstack/react-router";
import { useCallback, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import {
  getValidationSchema,
  IRegisterFormValues,
} from "../model/validation-schema";

export const useRegisterForm = () => {
  const { t } = useTranslation(["register"]);
  const authStore = useAuthStore();
  const navigate = useNavigate();

  const schema = useMemo(() => getValidationSchema(t), [t]);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<IRegisterFormValues>({
    resolver: zodResolver(schema),
  });

  const handleRegister = useCallback(
    async (data: IRegisterFormValues) => {
      console.log("Registered!", data);
      authStore.setAccessToken("fake-access-token");
      await navigate({ to: "/", replace: true });
    },
    [authStore, navigate],
  );

  return {
    t,
    control,
    errors,
    handleSubmit: handleSubmit(handleRegister),
  };
};
