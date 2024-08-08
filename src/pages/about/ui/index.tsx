import type { FC } from "react";
import { useTranslation } from "react-i18next";

import { Header } from "../../../shared/header";

export const AboutPage: FC = () => {
  const { t } = useTranslation(["about"]);
  return (
    <>
      <Header />
      {t("about:text")}
    </>
  );
};
