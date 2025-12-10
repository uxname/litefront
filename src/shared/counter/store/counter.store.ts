import { create } from "zustand";
import { devtools } from "zustand/middleware";

export interface CounterStore {
  counter: number;
  increase: () => void;
}

export const useCounterStore = create(
  devtools<CounterStore>((set) => ({
    counter: 0,
    increase: (): void => set((state) => ({ counter: state.counter + 1 })),
  })),
);
