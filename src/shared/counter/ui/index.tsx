import { useCounterStore } from "@shared/counter/lib/counter.store.ts";
import { toast } from "@shared/ui/Toaster";
import { FC } from "react";

export interface CounterProps {
  title?: string;
}

export const Counter: FC<CounterProps> = ({ title = "Counter" }) => {
  const { counter, increase } = useCounterStore();

  const onClick = () => {
    toast("Counter increased!", {
      description: `Current counter value: ${counter}`,
    });
    increase();
  };

  return (
    <div>
      <h3>
        {title}: {counter}
      </h3>
      <button className={"btn btn-outline btn-primary"} onClick={onClick}>
        Increase
      </button>
    </div>
  );
};
