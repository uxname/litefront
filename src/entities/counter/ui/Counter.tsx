import { m } from "@generated/paraglide/messages";
import { Button } from "@shared/ui/Button";
import { toast } from "@shared/ui/Toaster";
import { Plus } from "lucide-react";
import { FC } from "react";
import { useCounterStore } from "../model/store";

export interface CounterProps {
  title?: string;
}

export const Counter: FC<CounterProps> = ({ title }) => {
  const { counter, increase } = useCounterStore();

  const onClick = () => {
    toast.success(m.counter_toast_title(), {
      description: m.counter_toast_desc({ value: counter + 1 }),
    });
    increase();
  };

  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-[240px]">
      <div className="text-center space-y-1">
        <span className="text-[10px] font-bold text-base-content/70 uppercase tracking-widest">
          {title ?? m.counter_current_value()}
        </span>
        <div className="text-6xl font-black text-base-content tracking-tight leading-none tabular-nums select-none">
          {counter}
        </div>
      </div>

      <Button
        onClick={onClick}
        className="group relative w-full shadow-lg hover:-translate-y-0.5 hover:shadow-xl active:translate-y-0"
        leftIcon={
          <Plus className="h-4 w-4 transition-transform group-hover:rotate-90" />
        }
      >
        {m.counter_increment()}
      </Button>
    </div>
  );
};
