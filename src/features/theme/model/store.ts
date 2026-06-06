import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Theme = "cmyk" | "dark";

export interface ThemeStore {
  theme: Theme;
  toggle: () => void;
  setTheme: (theme: Theme) => void;
}

/** Apply the DaisyUI theme to the document root (themes declared in index.css). */
export const applyTheme = (theme: Theme): void => {
  if (typeof document !== "undefined") {
    document.documentElement.dataset.theme = theme;
  }
};

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set, get) => ({
      theme: "cmyk",
      toggle: () => {
        const next: Theme = get().theme === "dark" ? "cmyk" : "dark";
        applyTheme(next);
        set({ theme: next });
      },
      setTheme: (theme) => {
        applyTheme(theme);
        set({ theme });
      },
    }),
    {
      name: "litefront-theme",
      onRehydrateStorage: () => (state) => {
        if (state) applyTheme(state.theme);
      },
    },
  ),
);
