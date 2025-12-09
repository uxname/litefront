import { Link } from "@tanstack/react-router";
import { FileQuestion, Home } from "lucide-react";
import React from "react";
import * as m from "../../../generated/paraglide/messages";

export const NotFoundPage: React.FC = () => {
  return (
    <main className="relative min-h-screen w-full bg-slate-50 flex items-center justify-center p-4 overflow-hidden font-sans">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-200/20 rounded-full blur-3xl pointer-events-none -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl pointer-events-none translate-x-1/2 translate-y-1/2" />

      <div className="relative z-10 w-full max-w-lg bg-white rounded-2xl border border-slate-200 shadow-xl p-8 sm:p-12 text-center animate-in fade-in zoom-in duration-300">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 ring-1 ring-indigo-100">
          <FileQuestion className="h-10 w-10" strokeWidth={1.5} />
        </div>

        <p className="text-xs font-bold text-indigo-600 uppercase tracking-widest mb-3">
          404 Error
        </p>

        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl mb-4">
          {m.not_found_title?.() ?? "Page not found"}
        </h1>

        <p className="text-base text-slate-500 leading-relaxed mb-8">
          {m.not_found_message()}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/"
            preload="viewport"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-colors shadow-sm shadow-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600"
          >
            <Home className="h-4 w-4" />
            {m.back_to_home()}
          </Link>
        </div>
      </div>
    </main>
  );
};
