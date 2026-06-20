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
      // Skip automatic hydration: under SSR the store must render its default
      // ("cmyk") on the first client paint to match the server (so the toggle
      // icon doesn't trigger a hydration mismatch). The persisted value is
      // pulled in explicitly after mount via `persist.rehydrate()` (see
      // ThemeToggle); the visual theme itself is applied pre-paint by the inline
      // script in __root, so there's no flash.
      skipHydration: true,
      onRehydrateStorage: () => (state) => {
        if (state) applyTheme(state.theme);
      },
    },
  ),
);
