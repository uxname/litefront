import { create } from 'zustand';

interface IClickState {
  count: number;
  increase: () => void;
  reset: () => void;
}

export const useClickStore = create<IClickState>((set) => ({
  count: 0,
  increase: () => set((state) => ({ count: state.count + 1 })),
  reset: () => set({ count: 0 }),
}));
