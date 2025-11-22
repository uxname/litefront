import { useCounterStore } from "@shared/counter/lib/counter.store.ts";
import { FC } from "react";

export interface CounterProps {
  title?: string;
}

export const Counter: FC<CounterProps> = ({ title = "Counter" }) => {
  const { counter, increase } = useCounterStore();
  return (
    <div>
      <h3>
        {title}: {counter}
      </h3>
      <button className={"btn btn-outline btn-primary"} onClick={increase}>
        Increase
      </button>
    </div>
  );
};
