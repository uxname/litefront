import { Link, useRouter } from "@tanstack/react-router";
import { ArrowLeft, FileQuestion, Home } from "lucide-react";
import React, { useCallback } from "react";
import * as m from "../../../generated/paraglide/messages";

// Utility for View Transitions (Progressive Enhancement)
const navigateWithTransition = (callback: () => void) => {
  if (!document.startViewTransition) {
    callback();
    return;
  }
  document.startViewTransition(() => {
    callback();
  });
};

export const NotFoundPage: React.FC = () => {
  const router = useRouter();

  const handleGoBack = useCallback(() => {
    navigateWithTransition(() => router.history.back());
  }, [router]);

  return (
    <main className="grid min-h-[100dvh] place-items-center bg-base-100 px-6 py-12 lg:px-8">
      <div className="text-center w-full max-w-lg animate-in fade-in zoom-in duration-300">
        {/* Unified Visual Icon Container */}
        <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-3xl bg-base-200/50 shadow-sm ring-1 ring-base-content/5">
          <FileQuestion
            className="h-10 w-10 text-primary opacity-80"
            strokeWidth={1.5}
          />
        </div>

        {/* Typography */}
        <p className="text-sm font-bold leading-7 text-primary uppercase tracking-widest opacity-80">
          404 Error
        </p>
        <h1 className="mt-2 text-4xl font-extrabold tracking-tight text-base-content sm:text-5xl">
          {m.not_found_title?.() ?? "Page not found"}
        </h1>
        <p className="mt-4 text-lg leading-7 text-base-content/60">
          {m.not_found_message()}
        </p>

        {/* Actions */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/"
            preload="viewport"
            className="btn btn-primary w-full sm:w-auto min-w-[140px] gap-2 shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary"
          >
            <Home className="h-4 w-4" />
            {m.back_to_home()}
          </Link>

          <button
            onClick={handleGoBack}
            className="btn btn-ghost w-full sm:w-auto min-w-[140px] gap-2 group border border-transparent hover:border-base-content/10 hover:bg-base-200 focus-visible:ring-2 focus-visible:ring-base-content/20"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Go back
          </button>
        </div>
      </div>
    </main>
  );
};
