import { FC, useCallback, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { yupResolver } from "@hookform/resolvers/yup";
import hideIcon from "@public/hide.png";
import viewIcon from "@public/view.png";
import { useAuthStore } from "@shared/auth-store/lib/auth.store.ts";
import { PageWrapper } from "@shared/page-wrapper";
import { useNavigate } from "@tanstack/react-router";
import * as yup from "yup";

import styles from "./index.module.scss";

export const LoginPage: FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { t } = useTranslation(["login"]);
  const authStore = useAuthStore();
  const navigate = useNavigate();

  const MIN_PASSWORD_LENGTH = 6;
  const schema = useMemo(
    () =>
      yup.object({
        email: yup
          .string()
          .email(t("login:invalidEmail"))
          .required(t("login:requiredEmail")),
        password: yup
          .string()
          .min(MIN_PASSWORD_LENGTH, t("login:passwordMinLength"))
          .required(t("login:requiredPassword")),
      }),
    [t],
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const togglePasswordVisibility = useCallback(() => {
    setShowPassword((previous) => !previous);
  }, []);

  const handleLogin = useCallback(async () => {
    authStore.setAccessToken("fake-access-token");
    console.log("Logged in!");
    await navigate({ to: "/" });
  }, [authStore, navigate]);

  return (
    <PageWrapper>
      <div className={styles.loginFormWrapper}>
        <h1 className={styles.loginFormTitle}>{t("login:title")}</h1>
        <div className={styles.line} />
        <form className={styles.loginForm} onSubmit={handleSubmit(handleLogin)}>
          <div className={styles.inputWrapper}>
            <input
              type="text"
              className={styles.loginFormInput}
              placeholder="Email"
              {...register("email")}
            />
            {errors.email?.message && (
              <p className={styles.error}>{t(errors.email.message)}</p>
            )}
          </div>
          <div className={styles.inputWrapper}>
            <input
              type={showPassword ? "text" : "password"}
              className={styles.loginFormInput}
              placeholder={t("login:password")}
              {...register("password")}
            />
            <span
              className={styles.passwordToggleIcon}
              onClick={togglePasswordVisibility}
            >
              <img
                src={showPassword ? hideIcon : viewIcon}
                alt={
                  showPassword
                    ? t("login:hidePassword")
                    : t("login:showPassword")
                }
                className={styles.eyeIcon}
              />
            </span>
            {errors.password?.message && (
              <p className={styles.error}>{t(errors.password.message)}</p>
            )}
          </div>
          <button type="submit" className={styles.loginFormButton}>
            {t("login:login")}
          </button>
        </form>
        <div className={styles.hiddenSignup}>
          <h2 className={styles.loginSignupTitle}>{t("login:newHere")}</h2>
          <button className={styles.loginSignupButton}>
            {t("login:signUp")}
          </button>
        </div>
      </div>
      <div className={styles.loginSignupWrapper}>
        <h2 className={styles.loginSignupTitle}>{t("login:newHere")}</h2>
        <button className={styles.loginSignupButton}>
          {t("login:signUp")}
        </button>
      </div>
    </PageWrapper>
  );
};
