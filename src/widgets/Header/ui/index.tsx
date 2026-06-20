import { Link } from "@tanstack/react-router";
import { FC } from "react";
import { HeaderControls } from "./HeaderControls";

interface HeaderProps {
  /** Title of the current page, shown next to the brand. */
  title?: string;
}

export const Header: FC<HeaderProps> = ({ title }) => {
  return (
    <nav className="flex w-full items-center justify-between gap-4">
      <div className="flex min-w-0 items-center gap-3">
        <Link
          to="/"
          aria-label="LiteFront — home"
          className="flex shrink-0 items-center gap-2 rounded-lg transition-opacity hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary font-black text-primary-content shadow-sm">
            L
          </span>
          <span className="hidden text-lg font-bold tracking-tight text-base-content sm:block">
            LiteFront
          </span>
        </Link>

        {title && (
          <>
            <span
              className="h-5 w-px shrink-0 bg-base-300"
              aria-hidden="true"
            />
            <span className="truncate text-sm font-semibold text-base-content">
              {title}
            </span>
          </>
        )}
      </div>

      <HeaderControls />
    </nav>
  );
};
