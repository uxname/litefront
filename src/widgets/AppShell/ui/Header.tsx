import { m } from "@generated/paraglide/messages";
import { Link } from "@tanstack/react-router";
import type { FC } from "react";
import { HeaderControls } from "./HeaderControls";

export const Header: FC = () => (
  <nav className="flex w-full items-center justify-between gap-4">
    <Link
      to="/"
      className="flex shrink-0 items-center gap-2 rounded-lg outline-none transition-opacity hover:opacity-80 focus-visible:ring-[3px] focus-visible:ring-ring/50"
    >
      <span
        aria-hidden="true"
        className="flex size-8 items-center justify-center rounded-lg bg-primary font-black text-primary-foreground shadow-sm"
      >
        L
      </span>
      {/* The link's name is the app name (no aria-label: it must contain the
          visible text, WCAG 2.5.3); on phones it is hidden visually only. */}
      <span className="sr-only text-lg font-bold tracking-tight sm:not-sr-only">
        {m.app_name()}
      </span>
    </Link>

    <HeaderControls />
  </nav>
);
