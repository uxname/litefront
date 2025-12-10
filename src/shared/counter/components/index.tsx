import { useCounterStore } from "@shared/counter";
import { toast } from "@shared/ui/Toaster";
import { Plus } from "lucide-react";
import { FC } from "react";

export interface CounterProps {
  title?: string;
}

export const Counter: FC<CounterProps> = ({ title = "Current Value" }) => {
  const { counter, increase } = useCounterStore();

  const onClick = () => {
    toast.success("Counter updated", {
      description: `New value has been set to ${counter + 1}`,
    });
    increase();
  };

  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-[240px]">
      <div className="text-center space-y-1">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          {title}
        </span>
        <div className="text-6xl font-black text-slate-900 tracking-tight leading-none tabular-nums select-none">
          {counter}
        </div>
      </div>

      <button
        onClick={onClick}
        className="group relative flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-200 transition-all hover:bg-slate-800 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 active:scale-95"
      >
        <Plus className="h-4 w-4 transition-transform group-hover:rotate-90" />
        Increment
      </button>
    </div>
  );
};
