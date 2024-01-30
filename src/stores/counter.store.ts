import { create } from "zustand";

export interface ICounterStore {
  counter: number;
  increase: () => void;
}

export const useCounterStore = create<ICounterStore>((set) => ({
  counter: 0,
  increase: (): void => set((state) => ({ counter: state.counter + 1 })),
}));
