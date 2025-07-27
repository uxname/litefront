import { zodResolver } from "@hookform/resolvers/zod";
import { useAuthStore } from "@shared/auth-store/lib/auth.store.ts";
import { useNavigate } from "@tanstack/react-router";
import { FC, useCallback } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import {
  getValidationSchema,
  ILoginFormValues,
} from "../model/validation-schema";

export const LoginForm: FC = () => {
  const { t } = useTranslation(["login"]);
  const authStore = useAuthStore();
  const navigate = useNavigate();

  const schema = getValidationSchema(t);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const handleLogin = useCallback(
    async (data: ILoginFormValues) => {
      authStore.setAccessToken("fake-access-token");
      console.log("Logged in!", data);
      await navigate({ to: "/", replace: true });
    },
    [authStore, navigate],
  );

  return (
    <form
      className="flex flex-col gap-4 w-full max-w-md mx-auto p-6 bg-base-100 rounded-lg shadow-lg"
      onSubmit={handleSubmit(handleLogin)}
    >
      <h1 className="text-3xl font-bold text-center mb-6">
        {t("login:form.title")}
      </h1>

      <div className="form-control w-full">
        <Controller
          name="email"
          control={control}
          render={({ field }) => (
            <>
              <input
                {...field}
                id="email"
                type="email"
                placeholder={t("login:form.email")}
                className={`input input-bordered w-full ${errors.email ? "input-error" : ""}`}
              />
              {errors.email && (
                <label htmlFor="email" className="label">
                  <span className="label-text-alt text-error">
                    {t(errors.email.message as string)}
                  </span>
                </label>
              )}
            </>
          )}
        />
      </div>

      <div className="form-control w-full">
        <Controller
          name="password"
          control={control}
          render={({ field }) => (
            <>
              <input
                {...field}
                id="password"
                type="password"
                placeholder={t("login:form.password")}
                className={`input input-bordered w-full ${errors.password ? "input-error" : ""}`}
              />
              {errors.password && (
                <label htmlFor="password" className="label">
                  <span className="label-text-alt text-error">
                    {t(errors.password.message as string)}
                  </span>
                </label>
              )}
            </>
          )}
        />
      </div>

      <button type="submit" className="btn btn-primary w-full mt-4">
        {t("login:form.login")}
      </button>
    </form>
  );
};
