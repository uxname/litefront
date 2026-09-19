import { cn } from "@shared/lib/cn";
import { Loader2 } from "lucide-react";
import { ButtonHTMLAttributes, forwardRef, ReactNode } from "react";

type ButtonVariant = "primary" | "ghost" | "danger" | "danger-solid";
type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

// Shape, size, fill, hover, disabled and the 2px focus ring are daisyUI's `btn`.
// What stays a utility of ours is what daisyUI does not decide:
//  - the ring COLOUR — daisyUI draws the ring but falls back to the text colour,
//    and the design rule is "accent, or red for a destructive action";
//  - the `ghost` look, which has no daisyUI counterpart: `btn-ghost` is
//    borderless and `btn-outline` is dark, this one is a bordered button on the
//    page surface.
// A variant pins no shadow: two shadow utilities on one element are resolved by
// stylesheet order, so a built-in one could beat a call site's. The page decides
// how much a button lifts off the surface.
const VARIANTS: Record<ButtonVariant, string> = {
  primary: "btn-primary focus-visible:outline-primary",
  ghost:
    "bg-base-100 border-base-300 hover:bg-base-200 focus-visible:outline-primary",
  danger: "btn-outline btn-error focus-visible:outline-error",
  // The loud one: a filled red button for an action that breaks something.
  // `danger` above is its quiet sibling — an outline, not a fill.
  "danger-solid": "btn-error focus-visible:outline-error",
};

// md is daisyUI's default size, so it needs no modifier.
const SIZES: Record<ButtonSize, string> = {
  sm: "btn-sm",
  md: "",
  lg: "btn-lg",
};

/**
 * The button's class string, for the places that cannot render a <button>:
 * a router <Link> is an <a>, and a <button> inside an <a> is invalid HTML.
 * The component itself uses this too, so both paths always look the same.
 */
export const buttonClasses = ({
  variant = "primary",
  size = "md",
  className,
}: {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
} = {}): string =>
  cn(
    // `transition-all`, not daisyUI's own list: that one leaves out `scale` and
    // `translate`, so the press feedback here and the hover lifts call sites add
    // (`hover:-translate-y-0.5`, `hover:scale-[1.01]`) would snap instead of ease.
    "btn transition-all active:scale-95",
    VARIANTS[variant],
    SIZES[size],
    className,
  );

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
      className={buttonClasses({ variant, size, className })}
      {...rest}
    >
      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : leftIcon}
      {children}
      {rightIcon}
    </button>
  ),
);

Button.displayName = "Button";
