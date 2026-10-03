import { m } from "@generated/paraglide/messages";
import { getLocale, locales, setLocale } from "@generated/paraglide/runtime";
import { Button } from "@shared/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@shared/ui/dropdown-menu";
import { Languages } from "lucide-react";
import { type FC } from "react";

type Locale = (typeof locales)[number];

/**
 * Native language name for a locale code (e.g. "en" → "English", "ru" →
 * "Русский"), derived via Intl so adding a locale to `project.inlang` needs no
 * change here. Falls back to the upper-cased code if the runtime can't name it.
 */
const localeName = (loc: string): string => {
  try {
    const name = new Intl.DisplayNames([loc], { type: "language" }).of(loc);
    return name
      ? name.charAt(0).toUpperCase() + name.slice(1)
      : loc.toUpperCase();
  } catch {
    return loc.toUpperCase();
  }
};

/**
 * Language picker dropdown. Lists every locale from `locales`, so it scales
 * past two languages for free. `setLocale` persists the choice (localStorage
 * strategy) and reloads so all messages re-render in the new language.
 */
export const LocaleSwitcher: FC = () => {
  const current = getLocale();

  const select = (target: string) => {
    if (target !== current) setLocale(target as Locale);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" aria-label={m.locale_label()}>
          <Languages />
          <span className="text-xs font-bold uppercase">{current}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44">
        <DropdownMenuRadioGroup value={current} onValueChange={select}>
          {locales.map((loc) => (
            <DropdownMenuRadioItem key={loc} value={loc}>
              {localeName(loc)}
              <span className="ml-auto text-xs uppercase text-muted-foreground">
                {loc}
              </span>
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
