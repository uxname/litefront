import { Link } from "@tanstack/react-router";
import { FC } from "react";
import { useTranslation } from "react-i18next";

export const LoginSidebar: FC = () => {
  const { t } = useTranslation(["login"]);

  return (
    <>
      <h2 className="text-2xl font-bold mb-4">{t("login:sidebar.newHere")}</h2>
      <Link to="/register" preload="viewport" className="btn btn-primary">
        {t("login:sidebar.signUp")}
      </Link>
    </>
  );
};
