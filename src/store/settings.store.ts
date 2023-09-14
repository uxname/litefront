import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

type ISettingsState = {
  debugMode: boolean;
  setDebugMode: (debugMode: boolean) => void;
};

export const useSettingsStore = create(
  persist<ISettingsState>(
    (set) => ({
      debugMode: false,
      setDebugMode: (debugMode: boolean): void => set({ debugMode }),
    }),
    {
      name: 'settings-storage',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
