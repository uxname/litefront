import { Link } from "@tanstack/react-router";
import { FC } from "react";
import { useTranslation } from "react-i18next";

export const RegisterSidebar: FC = () => {
  const { t } = useTranslation(["register"]);

  return (
    <>
      <h2 className="text-2xl font-bold mb-4">
        {t("register:sidebar.alreadyRegistered")}
      </h2>
      <Link to="/login" preload="viewport" className="btn btn-primary">
        {t("register:sidebar.login")}
      </Link>
    </>
  );
};
