import { useCounterStore } from "@shared/counter/lib/counter.store.ts";
import { FC } from "react";

export interface ICounterProperties {
  title?: string;
}

export const Counter: FC<ICounterProperties> = ({ title = "Counter" }) => {
  const { counter, increase } = useCounterStore();
  return (
    <div>
      <h3>
        {title}: {counter}
      </h3>
      <button onClick={increase}>Increase</button>
    </div>
  );
};
