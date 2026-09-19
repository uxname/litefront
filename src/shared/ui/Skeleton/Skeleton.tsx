import { cn } from "@shared/lib/cn";
import { CSSProperties, FC } from "react";

type SkeletonVariant = "line" | "circle" | "rect";

export interface SkeletonProps {
  variant?: SkeletonVariant;
  width?: number | string;
  height?: number | string;
  className?: string;
}

const VARIANTS: Record<SkeletonVariant, string> = {
  line: "h-4 w-full rounded",
  circle: "rounded-full",
  rect: "w-full rounded-xl",
};

export const Skeleton: FC<SkeletonProps> = ({
  variant = "line",
  width,
  height,
  className,
}) => {
  const style: CSSProperties = {};
  if (width !== undefined) style.width = width;
  if (height !== undefined) style.height = height;

  return (
    <div
      aria-hidden="true"
      style={style}
      // `skeleton` is daisyUI's fill and shimmer. It has no shape variants, so
      // the three shapes stay utilities — which outrank its default radius.
      className={cn("skeleton", VARIANTS[variant], className)}
    />
  );
};
