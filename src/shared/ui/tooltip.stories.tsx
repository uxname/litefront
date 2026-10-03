import type { Meta, StoryFn } from "@storybook/react-vite";
import { Copy } from "lucide-react";
import { Button } from "./button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./tooltip";

export default { component: Tooltip } satisfies Meta<typeof Tooltip>;

export const Open: StoryFn = () => (
  <TooltipProvider>
    <div className="p-12">
      <Tooltip defaultOpen>
        <TooltipTrigger asChild>
          <Button variant="secondary" size="icon" aria-label="Copy">
            <Copy />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Copy stack trace</TooltipContent>
      </Tooltip>
    </div>
  </TooltipProvider>
);
