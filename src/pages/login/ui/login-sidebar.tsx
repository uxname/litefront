import { FC } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "@tanstack/react-router";
import { Button } from "antd";

import styles from "./index.module.scss";

export const LoginSidebar: FC = () => {
  const { t } = useTranslation(["login"]);

  return (
    <>
      <h2 className={styles.sidebarTitle}>{t("login:sidebar.newHere")}</h2>
      <Link to="/register" preload="viewport">
        <Button type="primary">{t("login:sidebar.signUp")}</Button>
      </Link>
    </>
  );
};
