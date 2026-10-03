import { m } from "@generated/paraglide/messages";
import { Button } from "@shared/ui/button";
import { toast } from "@shared/ui/sonner";
import { Plus } from "lucide-react";
import type { FC } from "react";
import { useCounterStore } from "../model/store";

export const Counter: FC = () => {
  const { counter, increase } = useCounterStore();

  const onClick = () => {
    toast.success(m.counter_toast_title(), {
      description: m.counter_toast_desc({ value: counter + 1 }),
    });
    increase();
  };

  return (
    <div className="flex w-full max-w-[240px] flex-col items-center gap-4">
      <div className="space-y-1 text-center">
        <p className="text-xs font-bold tracking-widest text-muted-foreground uppercase">
          {m.counter_current_value()}
        </p>
        <p className="text-6xl leading-none font-black tracking-tight tabular-nums select-none">
          {counter}
        </p>
      </div>

      <Button
        onClick={onClick}
        className="group w-full shadow-lg hover:-translate-y-0.5 hover:shadow-xl active:translate-y-0"
      >
        <Plus className="transition-transform group-hover:rotate-90" />
        {m.counter_increment()}
      </Button>
    </div>
  );
};
