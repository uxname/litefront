import { Link } from "@tanstack/react-router";
import { FC, ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { AiOutlineArrowLeft } from "react-icons/ai";

import styles from "./index.module.scss";

export const LayoutAuth: FC<ILayoutAuthProperties> = ({
  firstPanelChildren,
  secondPanelChildren,
}) => {
  const { t } = useTranslation(["auth"]);

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <Link preload="intent" to="/" className={styles.backButton}>
          <AiOutlineArrowLeft />
          {t("auth:goHome")}
        </Link>
        {firstPanelChildren}
      </div>
      <div className={styles.sidebar}>{secondPanelChildren}</div>
    </div>
  );
};

interface ILayoutAuthProperties {
  firstPanelChildren: ReactNode;
  secondPanelChildren: ReactNode;
}
