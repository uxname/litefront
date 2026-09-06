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
        "w-full resize-y rounded-xl border bg-base-100 px-3.5 py-2.5 text-sm text-base-content placeholder:text-base-content/70 transition-colors",
        // The outline colour lives in the invalid/valid branch below, not
        // here: cn() only joins, so two outline-* classes in one string are
        // resolved by stylesheet order rather than by the order written.
        "focus-visible:outline-2 focus-visible:outline-offset-2",
        "disabled:cursor-not-allowed disabled:bg-base-200 disabled:text-base-content/70",
        invalid
          ? "border-error focus-visible:outline-error"
          : "border-base-300 focus-visible:outline-primary",
        className,
      )}
      {...rest}
    />
  ),
);

Textarea.displayName = "Textarea";
