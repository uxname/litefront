import { create } from 'zustand';

type IClickState = {
  count: number;
  increase: () => void;
  reset: () => void;
};

export const useClickStore = create<IClickState>((set) => ({
  count: 0,
  increase: (): void => set((state) => ({ count: state.count + 1 })),
  reset: (): void => set({ count: 0 }),
}));
