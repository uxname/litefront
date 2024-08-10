import { FC, useCallback } from "react";

import { useAuthStore } from "../../../shared/auth-store/lib/auth.store.ts";

import styles from "./index.module.scss";

export const RegisterPage: FC = () => {
  const authStore = useAuthStore();

  const handleRegister = useCallback(() => {
    authStore.setAccessToken("fake-access-token");
  }, [authStore]);

  return (
    <>
      <div className={styles.container}>
        <input type="text" placeholder="Login" />
        <input type="password" placeholder="Password" />
        <button onClick={handleRegister}>Register</button>
      </div>
    </>
  );
};
