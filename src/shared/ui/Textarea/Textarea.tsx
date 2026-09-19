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
        "textarea w-full resize-y placeholder:text-base-content/70",
        // Size, radius, disabled state and the 2px ring are daisyUI's. An invalid
        // field is daisyUI's `textarea-error` — red border and red ring in one class. A
        // valid one keeps two utilities daisyUI does not decide our way: its
        // default border is fainter than the `base-300` the themes were tuned
        // for, and its ring is the text colour where the design rule says accent.
        invalid
          ? "textarea-error"
          : "border-base-300 focus-visible:outline-primary",
        className,
      )}
      {...rest}
    />
  ),
);

Textarea.displayName = "Textarea";
