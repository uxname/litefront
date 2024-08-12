import { FC, useState } from "react";
import { PageWrapper } from "@shared/page-wrapper ";

import styles from "./index.module.scss";

export const LoginPage: FC = () => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = (): void => {
    setShowPassword(!showPassword);
  };
  return (
    <PageWrapper>
      <div className={styles.loginFormWrapper}>
        <h1 className={styles.loginFormTitle}>Login to Your Account</h1>
        <div className={styles.line} />
        <form action="" className={styles.loginForm}>
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
              placeholder="Password"
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
          <button className={styles.loginFormButton}>Login</button>

          <div className={styles.hiddenSignup}>
            <h2 className={styles.loginSignupTitle}>New Here ? </h2>
            <span className={styles.loginSignupDescription}>Sign up !</span>
            <button className={styles.loginSignupButton}>Sign Up</button>
          </div>
        </form>
      </div>
      <div className={styles.loginSignupWrapper}>
        <h2 className={styles.loginSignupTitle}>New Here ? </h2>
        <span className={styles.loginSignupDescription}>Sign up !</span>
        <button className={styles.loginSignupButton}>Sign Up</button>
      </div>
    </PageWrapper>
  );
};
