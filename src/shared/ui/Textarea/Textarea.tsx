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
        "focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary",
        "disabled:cursor-not-allowed disabled:bg-base-200 disabled:text-base-content/70",
        invalid
          ? "border-error focus:ring-error/50 focus:border-error"
          : "border-base-300",
        className,
      )}
      {...rest}
    />
  ),
);

Textarea.displayName = "Textarea";
