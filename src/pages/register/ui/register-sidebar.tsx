import { Link } from "@tanstack/react-router";
import { Button } from "antd";
import { FC } from "react";
import { useTranslation } from "react-i18next";

import styles from "./index.module.scss";

export const RegisterSidebar: FC = () => {
  const { t } = useTranslation(["register"]);

  return (
    <>
      <h2 className={styles.sidebarTitle}>
        {t("register:sidebar.alreadyRegistered")}
      </h2>
      <Link to="/login" preload="viewport">
        <Button type="primary">{t("register:sidebar.login")}</Button>
      </Link>
    </>
  );
};
