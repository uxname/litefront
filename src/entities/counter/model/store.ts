import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { CounterStore } from "./types";

export const useCounterStore = create(
  devtools<CounterStore>((set) => ({
    counter: 0,
    increase: () => set((state) => ({ counter: state.counter + 1 })),
  })),
);
