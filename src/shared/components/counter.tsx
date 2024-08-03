import { FC } from "react";

import { useCounterStore } from "../../stores/counter.store.ts";

export const Counter: FC = () => {
  const { counter, increase } = useCounterStore();
  return (
    <div>
      <h3>Counter: {counter}</h3>
      <button onClick={increase}>Increase</button>
    </div>
  );
};
