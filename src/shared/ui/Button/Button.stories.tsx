import type { Meta, StoryFn } from "@storybook/react-vite";
import { ArrowRight, Mail } from "lucide-react";
import { Button } from "./Button";

export default { component: Button } satisfies Meta<typeof Button>;

export const Primary: StoryFn = () => (
  <Button className="shadow-sm">Primary action</Button>
);

export const Ghost: StoryFn = () => <Button variant="ghost">Ghost</Button>;

export const Danger: StoryFn = () => <Button variant="danger">Delete</Button>;

export const DangerSolid: StoryFn = () => (
  <Button variant="danger-solid" className="shadow-sm">
    Crash the app
  </Button>
);

export const Sizes: StoryFn = () => (
  <div className="flex items-center gap-3">
    <Button size="sm">Small</Button>
    <Button size="md">Medium</Button>
    <Button size="lg">Large CTA</Button>
  </div>
);

export const Loading: StoryFn = () => <Button loading>Saving…</Button>;

export const WithLeftIcon: StoryFn = () => (
  <Button leftIcon={<Mail className="h-4 w-4" />}>Email</Button>
);

export const WithRightIcon: StoryFn = () => (
  <Button rightIcon={<ArrowRight className="h-4 w-4" />}>Continue</Button>
);

export const Disabled: StoryFn = () => <Button disabled>Unavailable</Button>;
