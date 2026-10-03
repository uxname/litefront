import { m } from "@generated/paraglide/messages";
import { Button } from "@shared/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@shared/ui/dropdown-menu";
import { Monitor, Moon, Sun } from "lucide-react";
import { type FC, useEffect } from "react";
import { followSystemTheme, type Theme, useThemeStore } from "../model/store";

const OPTIONS: { value: Theme; icon: typeof Sun; label: () => string }[] = [
  { value: "light", icon: Sun, label: m.theme_light },
  { value: "dark", icon: Moon, label: m.theme_dark },
  { value: "system", icon: Monitor, label: m.theme_system },
];

export const ThemeToggle: FC = () => {
  const theme = useThemeStore((s) => s.theme);
  const setTheme = useThemeStore((s) => s.setTheme);

  // Pull the persisted theme into the store on the client after mount. The store
  // uses `skipHydration`, so it renders its default on the first paint (matching
  // the server) and only here syncs to the saved value — updating the icon and
  // re-applying the theme without clobbering localStorage. The visual theme is
  // already set pre-paint by the inline script in __root, so there's no flash.
  useEffect(() => {
    void useThemeStore.persist.rehydrate();
  }, []);

  useEffect(() => {
    if (theme === "system") return followSystemTheme();
  }, [theme]);

  const Current = OPTIONS.find((o) => o.value === theme)?.icon ?? Monitor;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label={m.theme_toggle()}>
          <Current />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuRadioGroup
          value={theme}
          onValueChange={(value) => setTheme(value as Theme)}
        >
          {OPTIONS.map(({ value, icon: Icon, label }) => (
            <DropdownMenuRadioItem key={value} value={value}>
              <Icon />
              {label()}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
