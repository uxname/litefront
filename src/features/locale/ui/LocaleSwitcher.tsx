import { m } from "@generated/paraglide/messages";
import { getLocale, locales, setLocale } from "@generated/paraglide/runtime";
import { Languages } from "lucide-react";
import { type FC } from "react";

/**
 * Cycles the Paraglide locale (en ↔ ru). `setLocale` persists the choice and
 * reloads so all messages re-render in the new language.
 */
export const LocaleSwitcher: FC = () => {
  const current = getLocale();

  const next = () => {
    const list = locales as readonly string[];
    const idx = list.indexOf(current);
    const target = list[(idx + 1) % list.length];
    setLocale(target as (typeof locales)[number]);
  };

  return (
    <button
      type="button"
      onClick={next}
      aria-label={m.locale_label()}
      title={m.locale_label()}
      className="flex h-9 items-center gap-1.5 rounded-lg px-2.5 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900"
    >
      <Languages className="h-4 w-4" />
      <span className="text-xs font-bold uppercase">{current}</span>
    </button>
  );
};
