import { FC, useCallback } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { yupResolver } from "@hookform/resolvers/yup";
import { useAuthStore } from "@shared/auth-store/lib/auth.store.ts";
import { useNavigate } from "@tanstack/react-router";
import { Button, Form, Input } from "antd";

import {
  getValidationSchema,
  ILoginFormValues,
} from "../model/validation-schema";

import styles from "./index.module.scss";

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
    resolver: yupResolver(schema),
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
    <form className={styles.authForm} onSubmit={handleSubmit(handleLogin)}>
      <h1 className={styles.formTitle}>{t("login:form.title")}</h1>

      <Form.Item
        validateStatus={errors.email ? "error" : ""}
        help={errors.email?.message ? t(errors.email.message) : undefined}
      >
        <Controller
          name="email"
          control={control}
          render={({ field }) => (
            <Input
              size="large"
              {...field}
              type="text"
              placeholder={t("login:form.email")}
            />
          )}
        />
      </Form.Item>

      <Form.Item
        validateStatus={errors.password ? "error" : ""}
        help={errors.password?.message ? t(errors.password.message) : undefined}
      >
        <Controller
          name="password"
          control={control}
          render={({ field }) => (
            <Input.Password
              size="large"
              {...field}
              placeholder={t("login:form.password")}
            />
          )}
        />
      </Form.Item>

      <Button
        disabled={Object.keys(errors).length > 0}
        htmlType="submit"
        type="primary"
      >
        {t("login:form.login")}
      </Button>
    </form>
  );
};
