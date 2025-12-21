import { Link } from "@tanstack/react-router";
import { Ghost, Home, MoveLeft, Search } from "lucide-react";
import React from "react";
import * as m from "../../../generated/paraglide/messages";

export const NotFoundPage: React.FC = () => {
  const handleGoBack = () => {
    window.history.back();
  };

  return (
    <main className="relative min-h-screen w-full bg-slate-50 flex items-center justify-center p-6 overflow-hidden font-sans selection:bg-indigo-100 selection:text-indigo-900">
      {/* Background Orbs */}
      <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-indigo-200/30 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-5%] left-[-5%] w-[400px] h-[400px] bg-blue-200/30 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-2xl text-center">
        {/* Floating Icon Illustration */}
        <div className="relative mb-12 flex justify-center">
          <div className="absolute inset-0 bg-indigo-500/20 rounded-full blur-3xl scale-75 animate-pulse" />
          <div className="relative bg-white rounded-3xl p-8 shadow-2xl border border-slate-200 animate-in zoom-in duration-500">
            <Ghost
              className="h-24 w-24 text-indigo-600 animate-bounce"
              strokeWidth={1.2}
            />
          </div>

          {/* Decorative particles */}
          <div className="absolute -top-4 -right-4 h-8 w-8 bg-blue-400 rounded-full blur-xl opacity-60 animate-pulse" />
          <div className="absolute -bottom-2 -left-6 h-12 w-12 bg-purple-400 rounded-full blur-2xl opacity-40 animate-pulse" />
        </div>

        {/* Error Text */}
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900 text-white text-xs font-black uppercase tracking-[0.2em] mb-4">
            <Search className="w-3 h-3" />
            Error Code: 404
          </div>

          <h1 className="text-5xl sm:text-7xl font-black tracking-tight text-slate-900">
            {m.not_found_title?.() ?? "Lost in the void"}
          </h1>

          <p className="text-lg sm:text-xl text-slate-500 max-w-lg mx-auto leading-relaxed">
            {m.not_found_message()}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-10 duration-700 delay-200">
          <button
            onClick={handleGoBack}
            className="group w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-white text-slate-700 font-bold border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all shadow-sm active:scale-95"
          >
            <MoveLeft className="h-5 w-5 transition-transform group-hover:-translate-x-1" />
            {m.go_back()}
          </button>

          <Link
            to="/"
            preload="viewport"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200 hover:shadow-2xl active:scale-95 hover:-translate-y-0.5"
          >
            <Home className="h-5 w-5" />
            {m.back_to_home()}
          </Link>
        </div>
      </div>

      <div className="absolute top-1/2 left-10 h-1 w-12 bg-indigo-200 rounded-full rotate-45 hidden lg:block" />
      <div className="absolute bottom-1/4 right-20 h-1 w-16 bg-blue-200 rounded-full -rotate-12 hidden lg:block" />
    </main>
  );
};
