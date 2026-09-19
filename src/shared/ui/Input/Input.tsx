import { cn } from "@shared/lib/cn";
import { forwardRef, InputHTMLAttributes } from "react";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  invalid?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ invalid = false, className, ...rest }, ref) => (
    <input
      ref={ref}
      aria-invalid={invalid || undefined}
      className={cn(
        "input w-full placeholder:text-base-content/70",
        // Size, radius, disabled state and the 2px ring are daisyUI's. An invalid
        // field is daisyUI's `input-error` — red border and red ring in one class. A
        // valid one keeps two utilities daisyUI does not decide our way: its
        // default border is fainter than the `base-300` the themes were tuned
        // for, and its ring is the text colour where the design rule says accent.
        invalid
          ? "input-error"
          : "border-base-300 focus-visible:outline-primary",
        className,
      )}
      {...rest}
    />
  ),
);

Input.displayName = "Input";
