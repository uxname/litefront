import { useAuthStore } from "@shared/auth-store/lib/auth.store.ts";
import { Link } from "@tanstack/react-router";
import { FC, useCallback } from "react";

import logo from "../../../../.github/logo.svg";

import styles from "./index.module.scss";

export const Header: FC = () => {
  const authStore = useAuthStore();
  const handleLogout = useCallback(async () => {
    // eslint-disable-next-line no-alert
    if (confirm("Are you sure you want to logout?")) {
      authStore.clear();
    }
  }, [authStore]);
  return (
    <>
      <img src={logo} alt="logo" className={styles.logo} />
      <div className={styles.header}>
        <Link to="/" preload={"intent"} className="[&.active]:font-bold">
          Home
        </Link>{" "}
        <Link to="/about" preload={"intent"} className="[&.active]:font-bold">
          About
        </Link>
        <Link to="/login" preload={"intent"} className="[&.active]:font-bold">
          Login
        </Link>
        <Link
          to="/register"
          preload={"intent"}
          className="[&.active]:font-bold"
        >
          Register
        </Link>
        {authStore.accessToken && (
          <button className={styles.button} onClick={handleLogout}>
            Logout
          </button>
        )}
      </div>
      <hr />
    </>
  );
};
