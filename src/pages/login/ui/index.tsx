import { FC, useCallback, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { yupResolver } from "@hookform/resolvers/yup";
import { getValidationSchema } from "@pages/login/ui/validation-schema.ts";
import hideIcon from "@public/hide.svg";
import viewIcon from "@public/view.svg";
import { useAuthStore } from "@shared/auth-store/lib/auth.store.ts";
import { PageWrapper } from "@shared/page-wrapper";
import { Link, useNavigate } from "@tanstack/react-router";

import styles from "./index.module.scss";

export const LoginPage: FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { t } = useTranslation(["login"]);
  const authStore = useAuthStore();
  const navigate = useNavigate();

  const schema = useMemo(() => getValidationSchema(t), [t]);

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
          <Link to="/register" className={styles.loginSignupButton}>
            {t("login:signUp")}
          </Link>
        </div>
      </div>
      <div className={styles.loginSignupWrapper}>
        <h2 className={styles.loginSignupTitle}>{t("login:newHere")}</h2>
        <Link
          to="/register"
          className={styles.loginSignupButton}
          preload={"viewport"}
        >
          {t("login:signUp")}
        </Link>
      </div>
    </PageWrapper>
  );
};
