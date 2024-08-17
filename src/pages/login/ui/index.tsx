import { FC, useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAuthStore } from "@shared/auth-store/lib/auth.store.ts";
import { PageWrapper } from "@shared/page-wrapper";
import { useNavigate } from "@tanstack/react-router";

import styles from "./index.module.scss";

export const LoginPage: FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { t } = useTranslation(["login"]);
  const authStore = useAuthStore();
  const navigate = useNavigate();

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
        <div className={styles.loginForm}>
          <div className={styles.inputWrapper}>
            <input
              type="text"
              className={styles.loginFormInput}
              placeholder="Email"
            />
          </div>
          <div className={styles.inputWrapper}>
            <input
              type={showPassword ? "text" : "password"}
              className={styles.loginFormInput}
              placeholder={t("login:password")}
            />
            <span
              className={styles.passwordToggleIcon}
              onClick={togglePasswordVisibility}
            >
              {showPassword ? (
                <img src="/public/hide.png" alt="" className={styles.eyeIcon} />
              ) : (
                <img src="/public/view.png" alt="" className={styles.eyeIcon} />
              )}
            </span>
          </div>
          <button onClick={handleLogin} className={styles.loginFormButton}>
            {t("login:login")}
          </button>

          <div className={styles.hiddenSignup}>
            <h2 className={styles.loginSignupTitle}>{t("login:newHere")}</h2>
            <button className={styles.loginSignupButton}>
              {t("login:signUp")}
            </button>
          </div>
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
