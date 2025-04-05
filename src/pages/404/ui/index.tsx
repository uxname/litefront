import { Link } from "@tanstack/react-router";
import React from "react";
import { useTranslation } from "react-i18next";

import styles from "./index.module.scss";

export const NotFoundPage: React.FC = () => {
  const { t } = useTranslation(["not-found"]);

  return (
    <div className={styles.container}>
      <h1 className={styles.header}>404</h1>
      <p className={styles.message}>
        {t(
          "not-found:message",
          "Oops! The page you are looking for does not exist.",
        )}
      </p>
      <Link to={"/"} preload={"viewport"} className={styles.link}>
        {t("not-found:back-to-home", "Back to home")}
      </Link>
    </div>
  );
};
