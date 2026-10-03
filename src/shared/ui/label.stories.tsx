import type { Meta, StoryFn } from "@storybook/react-vite";
import { Input } from "./input";
import { Label } from "./label";

export default { component: Label } satisfies Meta<typeof Label>;

export const WithControl: StoryFn = () => (
  <div className="grid gap-2">
    <Label htmlFor="story-email">Email</Label>
    <Input id="story-email" placeholder="you@example.com" />
  </div>
);
