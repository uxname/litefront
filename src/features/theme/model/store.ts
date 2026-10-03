import { create } from "zustand";
import { persist } from "zustand/middleware";

/** The user's choice. "system" follows the OS colour-scheme setting. */
export type Theme = "light" | "dark" | "system";

const DARK_QUERY = "(prefers-color-scheme: dark)";

export interface ThemeStore {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

/** The theme actually painted: "system" resolved against the OS setting. */
export const resolveTheme = (theme: Theme): "light" | "dark" => {
  if (theme !== "system") return theme;
  return typeof window !== "undefined" && window.matchMedia(DARK_QUERY).matches
    ? "dark"
    : "light";
};

/** Paint a theme: index.css keys the dark tokens off `data-theme` on <html>. */
export const applyTheme = (theme: Theme): void => {
  if (typeof document !== "undefined") {
    document.documentElement.dataset.theme = resolveTheme(theme);
  }
};

/**
 * Re-paint on an OS colour-scheme change while the choice is "system".
 * Returns the unsubscribe function, so it slots straight into a useEffect.
 */
export const followSystemTheme = (): (() => void) => {
  const query = window.matchMedia(DARK_QUERY);
  const onChange = () => applyTheme("system");
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
};

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set) => ({
      theme: "system",
      setTheme: (theme) => {
        applyTheme(theme);
        set({ theme });
      },
    }),
    {
      name: "litefront-theme",
      // v0 stored daisyUI theme names; "cmyk" was the light one.
      version: 1,
      migrate: (persisted) => {
        const state = persisted as { theme?: string };
        return {
          theme: state.theme === "dark" ? "dark" : "light",
        } as ThemeStore;
      },
      // Skip automatic hydration: under SSR the store must render its default
      // ("system") on the first client paint to match the server (so the toggle
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
