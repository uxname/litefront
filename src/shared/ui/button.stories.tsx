import type { Meta, StoryFn } from "@storybook/react-vite";
import { ArrowRight, Plus, Trash2 } from "lucide-react";
import { Button } from "./button";
import { Spinner } from "./spinner";

export default { component: Button } satisfies Meta<typeof Button>;

export const Default: StoryFn = () => <Button>Save changes</Button>;

export const Outline: StoryFn = () => <Button variant="outline">Cancel</Button>;

export const Secondary: StoryFn = () => (
  <Button variant="secondary">Secondary</Button>
);

export const Ghost: StoryFn = () => <Button variant="ghost">Ghost</Button>;

export const Destructive: StoryFn = () => (
  <Button variant="destructive">
    <Trash2 />
    Delete account
  </Button>
);

export const Link: StoryFn = () => <Button variant="link">Read more</Button>;

export const Sizes: StoryFn = () => (
  <div className="flex items-center gap-3">
    <Button size="xs">Extra small</Button>
    <Button size="sm">Small</Button>
    <Button>Default</Button>
    <Button size="lg">Large</Button>
    <Button size="icon" aria-label="Add">
      <Plus />
    </Button>
  </div>
);

export const WithIcon: StoryFn = () => (
  <Button>
    Continue
    <ArrowRight />
  </Button>
);

export const Loading: StoryFn = () => (
  <Button disabled>
    <Spinner />
    Saving…
  </Button>
);

export const Disabled: StoryFn = () => <Button disabled>Unavailable</Button>;

export const AsLink: StoryFn = () => (
  <Button asChild variant="outline">
    <a href="#docs">Documentation</a>
  </Button>
);
