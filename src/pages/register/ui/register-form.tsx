import { FC, useCallback } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { yupResolver } from "@hookform/resolvers/yup";
import { useAuthStore } from "@shared/auth-store/lib/auth.store.ts";
import { useNavigate } from "@tanstack/react-router";
import { Button, Form, Input } from "antd";

import {
  getValidationSchema,
  IRegisterFormValues,
} from "../model/validation-schema";

import styles from "./index.module.scss";

export const RegisterForm: FC = () => {
  const { t } = useTranslation(["register"]);
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

  const handleRegister = useCallback(
    async (data: IRegisterFormValues) => {
      authStore.setAccessToken("fake-access-token");
      console.log("Registered!", data);
      await navigate({ to: "/", replace: true });
    },
    [authStore, navigate],
  );

  return (
    <form className={styles.authForm} onSubmit={handleSubmit(handleRegister)}>
      <h1 className={styles.formTitle}>{t("register:form.title")}</h1>

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
              placeholder={t("register:form.email")}
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
              placeholder={t("register:form.password")}
            />
          )}
        />
      </Form.Item>

      <Form.Item
        validateStatus={errors.passwordConfirmation ? "error" : ""}
        help={
          errors.passwordConfirmation?.message
            ? t(errors.passwordConfirmation.message)
            : undefined
        }
      >
        <Controller
          name="passwordConfirmation"
          control={control}
          render={({ field }) => (
            <Input.Password
              size="large"
              {...field}
              placeholder={t("register:form.passwordConfirmation")}
            />
          )}
        />
      </Form.Item>

      <Button
        disabled={Object.keys(errors).length > 0}
        htmlType="submit"
        type="primary"
      >
        {t("register:form.register")}
      </Button>
    </form>
  );
};
