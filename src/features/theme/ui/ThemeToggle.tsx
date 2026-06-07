import { m } from "@generated/paraglide/messages";
import { Moon, Sun } from "lucide-react";
import { type FC, useEffect } from "react";
import { useThemeStore } from "../model/store";

export const ThemeToggle: FC = () => {
  const theme = useThemeStore((s) => s.theme);
  const toggle = useThemeStore((s) => s.toggle);
  const setTheme = useThemeStore((s) => s.setTheme);

  // Ensure the DOM reflects the persisted theme on first mount.
  useEffect(() => {
    setTheme(theme);
  }, [theme, setTheme]);

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={m.theme_toggle()}
      title={m.theme_toggle()}
      className="flex h-9 w-9 items-center justify-center rounded-lg text-base-content/70 transition-colors hover:bg-base-200 hover:text-base-content focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
    >
      {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </button>
  );
};
