import { m } from "@generated/paraglide/messages";
import { Link } from "@tanstack/react-router";
import { Ghost, Home, MoveLeft, Search } from "lucide-react";
import React from "react";

export const NotFoundPage: React.FC = () => {
  const handleGoBack = () => {
    window.history.back();
  };

  return (
    <main className="relative min-h-screen w-full bg-base-200 flex items-center justify-center p-6 overflow-hidden font-sans selection:bg-primary/10 selection:text-primary">
      {/* Background Orbs */}
      <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-5%] left-[-5%] w-[400px] h-[400px] bg-info/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-2xl text-center">
        {/* Floating Icon Illustration */}
        <div className="relative mb-12 flex justify-center">
          <div className="absolute inset-0 bg-primary/10 rounded-full blur-3xl scale-75 animate-pulse" />
          <div className="relative bg-base-100 rounded-3xl p-8 shadow-2xl border border-base-300 animate-in zoom-in duration-500">
            <Ghost
              className="h-24 w-24 text-primary animate-bounce"
              strokeWidth={1.2}
            />
          </div>

          {/* Decorative particles */}
          <div className="absolute -top-4 -right-4 h-8 w-8 bg-info rounded-full blur-xl opacity-60 animate-pulse" />
          <div className="absolute -bottom-2 -left-6 h-12 w-12 bg-purple-400 rounded-full blur-2xl opacity-40 animate-pulse" />
        </div>

        {/* Error Text */}
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary text-primary-content text-xs font-black uppercase tracking-[0.2em] mb-4">
            <Search className="w-3 h-3" />
            Error Code: 404
          </div>

          <h1 className="text-5xl sm:text-7xl font-black tracking-tight text-base-content">
            {m.not_found_title?.() ?? "Lost in the void"}
          </h1>

          <p className="text-lg sm:text-xl text-base-content/70 max-w-lg mx-auto leading-relaxed">
            {m.not_found_message()}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-10 duration-700 delay-200">
          <button
            onClick={handleGoBack}
            className="group w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-base-100 text-base-content font-bold border border-base-300 hover:border-base-300 hover:bg-base-200 transition-all shadow-sm active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            <MoveLeft className="h-5 w-5 transition-transform group-hover:-translate-x-1" />
            {m.go_back()}
          </button>

          <Link
            to="/"
            preload="viewport"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-primary text-primary-content font-bold hover:bg-primary/90 transition-all shadow-xl hover:shadow-2xl active:scale-95 hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            <Home className="h-5 w-5" />
            {m.back_to_home()}
          </Link>
        </div>
      </div>

      <div className="absolute top-1/2 left-10 h-1 w-12 bg-primary/10 rounded-full rotate-45 hidden lg:block" />
      <div className="absolute bottom-1/4 right-20 h-1 w-16 bg-info/10 rounded-full -rotate-12 hidden lg:block" />
    </main>
  );
};
