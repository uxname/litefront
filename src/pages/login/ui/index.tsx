import { FC, useCallback, useEffect, useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { yupResolver } from "@hookform/resolvers/yup";
import { useAuthStore } from "@shared/auth-store/lib/auth.store.ts";
import { Link, useNavigate } from "@tanstack/react-router";
import { Button, Form, Input } from "antd";

import {
  getValidationSchema,
  ILoginFormValues,
} from "../model/validation-schema";

import styles from "./index.module.scss";

export const LoginPage: FC = () => {
  const { t } = useTranslation(["login"]);
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

  const handleLogin = useCallback(
    async (data: ILoginFormValues) => {
      authStore.setAccessToken("fake-access-token");
      console.log("Logged in!", data);
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
        <Link preload="intent" to="/" className={styles.backButton}>
          <AiOutlineArrowLeft />
          {t("login:goHome")}
        </Link>
        <h1 className={styles.formTitle}>{t("login:title")}</h1>
        <form className={styles.authForm} onSubmit={handleSubmit(handleLogin)}>
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
                  placeholder={t("login:email")}
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
                  size="large"
                  {...field}
                  placeholder={t("login:password")}
                />
              )}
            />
          </Form.Item>

          <Button
            disabled={Object.keys(errors).length > 0}
            htmlType="submit"
            type="primary"
          >
            {t("login:login")}
          </Button>
        </form>
      </div>

      <div className={styles.sidebar}>
        <h2 className={styles.sidebarTitle}>{t("login:newHere")}</h2>
        <Link to="/register" preload="viewport">
          <Button type="primary">{t("login:signUp")}</Button>
        </Link>
      </div>
    </div>
  );
};
