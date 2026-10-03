import type { Meta, StoryFn } from "@storybook/react-vite";
import { BadgeCheck } from "lucide-react";
import { Badge } from "./badge";

export default { component: Badge } satisfies Meta<typeof Badge>;

export const Variants: StoryFn = () => (
  <div className="flex flex-wrap gap-2">
    <Badge>Default</Badge>
    <Badge variant="secondary">Secondary</Badge>
    <Badge variant="outline">Outline</Badge>
    <Badge variant="destructive">Destructive</Badge>
  </div>
);

export const WithIcon: StoryFn = () => (
  <Badge variant="secondary">
    <BadgeCheck />
    Verified
  </Badge>
);
