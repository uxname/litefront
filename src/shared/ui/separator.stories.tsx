import type { Meta, StoryFn } from "@storybook/react-vite";
import { Separator } from "./separator";

export default { component: Separator } satisfies Meta<typeof Separator>;

export const Horizontal: StoryFn = () => (
  <div className="w-64 space-y-3 text-sm">
    <p>Above</p>
    <Separator />
    <p>Below</p>
  </div>
);

export const Vertical: StoryFn = () => (
  <div className="flex h-5 items-center gap-3 text-sm">
    <span>Docs</span>
    <Separator orientation="vertical" />
    <span>GitHub</span>
  </div>
);
