import { m } from "@generated/paraglide/messages";
import { getLocale, locales, setLocale } from "@generated/paraglide/runtime";
import { Check, Languages } from "lucide-react";
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

  const select = (target: Locale) => {
    if (target !== current) setLocale(target);
  };

  return (
    <details className="dropdown dropdown-end">
      <summary
        aria-label={m.locale_label()}
        title={m.locale_label()}
        className="flex h-9 cursor-pointer list-none items-center gap-1.5 rounded-lg px-2.5 text-base-content/60 transition-colors hover:bg-base-200 hover:text-base-content [&::-webkit-details-marker]:hidden"
      >
        <Languages className="h-4 w-4" />
        <span className="text-xs font-bold uppercase">{current}</span>
      </summary>

      <ul className="dropdown-content menu z-[60] mt-2 w-44 rounded-xl border border-base-300 bg-base-100 p-1.5 shadow-lg">
        {locales.map((loc) => (
          <li key={loc}>
            <button
              type="button"
              onClick={() => select(loc)}
              className="flex items-center justify-between gap-2 rounded-lg px-3 py-2 text-sm font-medium text-base-content hover:bg-base-200"
            >
              <span>
                {localeName(loc)}
                <span className="ml-1.5 text-xs uppercase text-base-content/50">
                  {loc}
                </span>
              </span>
              {loc === current && <Check className="h-4 w-4 text-primary" />}
            </button>
          </li>
        ))}
      </ul>
    </details>
  );
};
