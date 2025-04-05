import { Header } from "@shared/header";
import type { FC } from "react";
import { useTranslation } from "react-i18next";

export const AboutPage: FC = () => {
  const { t } = useTranslation(["about"]);
  return (
    <>
      <Header />
      {t("about:text")}
    </>
  );
};
