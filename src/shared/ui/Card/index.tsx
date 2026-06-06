import { cn } from "@shared/lib/cn";
import { FC, ReactNode } from "react";

export interface CardProps {
  title?: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  className?: string;
  bodyClassName?: string;
  children?: ReactNode;
}

export const Card: FC<CardProps> = ({
  title,
  description,
  actions,
  className,
  bodyClassName,
  children,
}) => (
  <section
    className={cn(
      "overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm",
      className,
    )}
  >
    {(title || actions) && (
      <header className="flex items-start justify-between gap-4 border-b border-slate-100 px-5 py-4">
        <div className="min-w-0">
          {title && (
            <h2 className="text-sm font-bold text-slate-900">{title}</h2>
          )}
          {description && (
            <p className="mt-0.5 text-sm text-slate-500">{description}</p>
          )}
        </div>
        {actions}
      </header>
    )}
    <div className={bodyClassName ?? "px-5 py-5"}>{children}</div>
  </section>
);
