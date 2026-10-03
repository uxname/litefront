import { m } from "@generated/paraglide/messages";
import { cn } from "@shared/lib/cn";
import { Loader2Icon } from "lucide-react";
import type * as React from "react";

function Spinner({
  className,
  "aria-label": label,
  ...props
}: React.ComponentProps<"svg">) {
  return (
    <Loader2Icon
      role="status"
      // An explicit `undefined` from a caller still gets the default.
      aria-label={label ?? m.common_loading()}
      className={cn("size-4 animate-spin", className)}
      {...props}
    />
  );
}

export { Spinner };
