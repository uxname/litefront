import { cn } from "@shared/lib/cn";
import { Loader2 } from "lucide-react";
import { ButtonHTMLAttributes, forwardRef, ReactNode } from "react";

type ButtonVariant = "primary" | "ghost" | "danger";
type ButtonSize = "sm" | "md";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  leftIcon?: ReactNode;
}

const VARIANTS: Record<ButtonVariant, string> = {
  primary: "bg-primary text-primary-content hover:bg-primary/90 shadow-sm",
  ghost:
    "bg-base-100 text-base-content border border-base-300 hover:bg-base-200",
  danger: "bg-base-100 text-error border border-error hover:bg-error/10",
};

const SIZES: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-5 py-2.5 text-sm",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      loading = false,
      leftIcon,
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
        "inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all active:scale-95 disabled:cursor-not-allowed disabled:opacity-60",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
        VARIANTS[variant],
        SIZES[size],
        className,
      )}
      {...rest}
    >
      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : leftIcon}
      {children}
    </button>
  ),
);

Button.displayName = "Button";
