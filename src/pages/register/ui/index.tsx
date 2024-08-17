import { FC, useCallback } from "react";
import { useAuthStore } from "@shared/auth-store/lib/auth.store.ts";
import { Link, useNavigate } from "@tanstack/react-router";

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
        <button
          className={styles.button}
          onClick={async () => {
            authStore.clear();
            await navigate({ to: "/" });
          }}
        >
          (DEBUG) LOGOUT
          <br />
          Current access token: {authStore.accessToken}
        </button>
        <Link to="/login" preload={"intent"}>
          Login
        </Link>
      </div>
    </>
  );
};
