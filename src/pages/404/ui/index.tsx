import { Link } from "@tanstack/react-router";
import React from "react";
import * as m from "../../../generated/paraglide/messages";

export const NotFoundPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen w-full font-sans text-gray-800 bg-white">
      <h1 className="text-8xl font-bold m-0 text-center">404</h1>
      <p className="text-2xl my-4 text-center">{m.not_found_message()}</p>
      <Link
        to="/"
        preload="viewport"
        className="btn btn-primary mt-8 px-6 py-2 text-lg"
      >
        {m.back_to_home()}
      </Link>
    </div>
  );
};
