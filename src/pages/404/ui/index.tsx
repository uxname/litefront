import { Link } from "@tanstack/react-router";
import React from "react";
import { useTranslation } from "react-i18next";

export const NotFoundPage: React.FC = () => {
  const { t } = useTranslation(["not-found"]);

  return (
    <div className="flex flex-col items-center justify-center h-screen w-full font-sans text-gray-800 bg-white">
      <h1 className="text-8xl font-bold m-0 text-center">404</h1>
      <p className="text-2xl my-4 text-center">
        {t(
          "not-found:message",
          "Oops! The page you are looking for does not exist.",
        )}
      </p>
      <Link
        to="/"
        preload="viewport"
        className="btn btn-primary mt-8 px-6 py-2 text-lg"
      >
        {t("not-found:back-to-home", "Back to home")}
      </Link>
    </div>
  );
};
