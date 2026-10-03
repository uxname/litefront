import type { Meta, StoryFn } from "@storybook/react-vite";
import { Spinner } from "./spinner";

export default { component: Spinner } satisfies Meta<typeof Spinner>;

export const Default: StoryFn = () => <Spinner />;

export const Large: StoryFn = () => (
  <Spinner className="size-8 text-muted-foreground" />
);
