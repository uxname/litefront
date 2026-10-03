import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { CounterStore } from "./types";

export const useCounterStore = create(
  devtools<CounterStore>(
    (set) => ({
      counter: 0,
      increase: () => set((state) => ({ counter: state.counter + 1 })),
    }),
    // The Redux DevTools bridge is a dev aid; production builds leave it off.
    { enabled: import.meta.env.DEV },
  ),
);
