import { FC, useCallback, useEffect, useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { yupResolver } from "@hookform/resolvers/yup";
import { useAuthStore } from "@shared/auth-store/lib/auth.store.ts";
import { Link, useNavigate } from "@tanstack/react-router";
import { Button, Form, Input } from "antd";

import {
  getValidationSchema,
  IRegisterFormValues,
} from "../model/validation-schema";

import styles from "./index.module.scss";

export const RegisterPage: FC = () => {
  const { t } = useTranslation(["register"]);
  const authStore = useAuthStore();
  const navigate = useNavigate();

  const schema = useMemo(() => getValidationSchema(t), [t]);

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

  useEffect(() => {
    if (authStore.accessToken) {
      navigate({ to: "/", replace: true });
    }
  }, [authStore.accessToken, navigate]);

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.formTitle}>{t("register:title")}</h1>
        <form
          className={styles.authForm}
          onSubmit={handleSubmit(handleRegister)}
        >
          <Form.Item
            validateStatus={errors.email ? "error" : ""}
            help={errors.email?.message ? t(errors.email.message) : undefined}
          >
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <Input
                  size={"large"}
                  {...field}
                  type="text"
                  placeholder={t("register:email")}
                />
              )}
            />
          </Form.Item>

          <Form.Item
            validateStatus={errors.password ? "error" : ""}
            help={
              errors.password?.message ? t(errors.password.message) : undefined
            }
          >
            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <Input.Password
                  size={"large"}
                  {...field}
                  placeholder={t("register:password")}
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
                  size={"large"}
                  {...field}
                  placeholder={t("register:passwordConfirmation")}
                />
              )}
            />
          </Form.Item>

          <Button
            disabled={Object.keys(errors).length > 0}
            htmlType="submit"
            type="primary"
          >
            {t("register:register")}
          </Button>
        </form>
      </div>
      <div className={styles.sidebar}>
        <h2 className={styles.sidebarTitle}>
          {t("register:alreadyRegistered")}
        </h2>
        <Link to="/login" preload={"viewport"}>
          <Button type="primary">{t("register:login")}</Button>
        </Link>
      </div>
    </div>
  );
};
