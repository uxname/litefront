import { m } from "@generated/paraglide/messages";
import { Bug, Zap } from "lucide-react";
import type { FC } from "react";
import { useErrorBoundary } from "react-error-boundary";

export const ErrorSimulator: FC = () => {
  const { showBoundary } = useErrorBoundary();

  return (
    <div className="bg-base-100 rounded-2xl border border-base-300 shadow-sm p-8 flex flex-col items-center justify-center relative overflow-hidden group">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-error to-warning"></div>
      <div className="mb-6 flex items-center gap-2 text-error bg-error/10 px-3 py-1 rounded-full text-xs font-bold uppercase">
        <Bug className="w-3 h-3" /> {m.home_error_boundary_badge()}
      </div>

      <div className="text-center space-y-1 mb-6">
        <span className="text-[10px] font-bold text-base-content/70 uppercase tracking-widest">
          {m.home_debug_tool()}
        </span>
        <div className="text-xl font-bold text-base-content tracking-tight">
          {m.home_system_resilience()}
        </div>
      </div>

      <button
        onClick={() =>
          showBoundary(
            new Error(
              "Simulated Critical Failure: This is a test of the Error Boundary system.",
            ),
          )
        }
        className="group relative flex w-full max-w-[200px] items-center justify-center gap-2 rounded-xl bg-error px-4 py-3 text-sm font-semibold text-error-content shadow-lg transition-all hover:bg-error/90 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-error"
      >
        <Zap className="h-4 w-4 fill-current" />
        {m.home_crash_app()}
      </button>

      <p className="text-xs text-base-content/70 mt-4 text-center max-w-[220px]">
        {m.home_error_sim_hint()}
      </p>
    </div>
  );
};
