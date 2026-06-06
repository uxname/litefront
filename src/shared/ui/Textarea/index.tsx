import { cn } from "@shared/lib/cn";
import { forwardRef, TextareaHTMLAttributes } from "react";

export interface TextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  invalid?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ invalid = false, className, rows = 4, ...rest }, ref) => (
    <textarea
      ref={ref}
      rows={rows}
      aria-invalid={invalid || undefined}
      className={cn(
        "w-full resize-y rounded-xl border bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 transition-colors",
        "focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400",
        "disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400",
        invalid
          ? "border-red-300 focus:ring-red-500/30 focus:border-red-400"
          : "border-slate-200",
        className,
      )}
      {...rest}
    />
  ),
);

Textarea.displayName = "Textarea";
