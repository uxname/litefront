import { m } from "@generated/paraglide/messages";
import { Moon, Sun } from "lucide-react";
import { type FC, useEffect } from "react";
import { useThemeStore } from "../model/store";

export const ThemeToggle: FC = () => {
  const theme = useThemeStore((s) => s.theme);
  const toggle = useThemeStore((s) => s.toggle);

  // Pull the persisted theme into the store on the client after mount. The store
  // uses `skipHydration`, so it renders its default on the first paint (matching
  // the server) and only here syncs to the saved value — updating the icon and
  // re-applying the theme without clobbering localStorage. The visual theme is
  // already set pre-paint by the inline script in __root, so there's no flash.
  useEffect(() => {
    void useThemeStore.persist.rehydrate();
  }, []);

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
