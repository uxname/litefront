import { FC, useCallback } from "react";
import { useNavigate } from "@tanstack/react-router";

import { useAuthStore } from "../../../shared/auth-store/lib/auth.store.ts";

import styles from "./index.module.scss";

export const RegisterPage: FC = () => {
  const authStore = useAuthStore();
  const navigate = useNavigate();

  const handleRegister = useCallback(async () => {
    authStore.setAccessToken("fake-access-token");
    console.log("Registered!");
    await navigate({ to: "/" });
  }, [authStore, navigate]);

  return (
    <>
      <div className={styles.container}>
        <input type="text" placeholder="Login" />
        <input type="password" placeholder="Password" />
        <button className={styles.button} onClick={handleRegister}>
          Register
        </button>
      </div>
    </>
  );
};
