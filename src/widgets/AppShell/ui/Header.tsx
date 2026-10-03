import { m } from "@generated/paraglide/messages";
import { Link } from "@tanstack/react-router";
import type { FC } from "react";
import { HeaderControls } from "./HeaderControls";

export const Header: FC = () => (
  <nav className="flex w-full items-center justify-between gap-4">
    <Link
      to="/"
      aria-label={m.header_home_aria()}
      className="flex shrink-0 items-center gap-2 rounded-lg outline-none transition-opacity hover:opacity-80 focus-visible:ring-[3px] focus-visible:ring-ring/50"
    >
      <span
        aria-hidden="true"
        className="flex size-8 items-center justify-center rounded-lg bg-primary font-black text-primary-foreground shadow-sm"
      >
        L
      </span>
      <span className="hidden text-lg font-bold tracking-tight sm:block">
        {m.app_name()}
      </span>
    </Link>

    <HeaderControls />
  </nav>
);
