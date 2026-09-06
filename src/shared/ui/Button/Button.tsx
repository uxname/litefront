import { cn } from "@shared/lib/cn";
import { Loader2 } from "lucide-react";
import { ButtonHTMLAttributes, forwardRef, ReactNode } from "react";

type ButtonVariant = "primary" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

const VARIANTS: Record<ButtonVariant, string> = {
  primary: "bg-primary text-primary-content hover:bg-primary/90 shadow-sm",
  ghost:
    "bg-base-100 text-base-content border border-base-300 hover:bg-base-200",
  danger: "bg-base-100 text-error border border-error hover:bg-error/10",
};

// Everything that a call site may want to override lives here, never in the
// base string: cn() is a plain join, so the winner of `rounded-xl rounded-2xl`
// is decided by the stylesheet order, not by the order in this string.
const SIZES: Record<ButtonSize, string> = {
  sm: "gap-2 rounded-xl px-3 py-1.5 text-sm font-semibold",
  md: "gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold",
  lg: "gap-3 rounded-2xl px-8 py-4 text-base font-bold",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      loading = false,
      leftIcon,
      rightIcon,
      disabled,
      className,
      children,
      type = "button",
      ...rest
    },
    ref,
  ) => (
    <button
      ref={ref}
      type={type}
      disabled={disabled || loading}
      className={cn(
        "inline-flex items-center justify-center transition-all active:scale-95 disabled:cursor-not-allowed disabled:opacity-60",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
        VARIANTS[variant],
        SIZES[size],
        className,
      )}
      {...rest}
    >
      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : leftIcon}
      {children}
      {rightIcon}
    </button>
  ),
);

Button.displayName = "Button";
