import type { Meta, StoryFn } from "@storybook/react-vite";
import { Textarea } from "./textarea";

export default { component: Textarea } satisfies Meta<typeof Textarea>;

export const Default: StoryFn = () => (
  <Textarea aria-label="Bio" placeholder="A few words about yourself" />
);

export const WithValue: StoryFn = () => (
  <Textarea aria-label="Bio" defaultValue="Mathematician and writer." />
);

export const Invalid: StoryFn = () => (
  <Textarea aria-label="Bio" aria-invalid defaultValue="Too long…" />
);

export const Disabled: StoryFn = () => (
  <Textarea aria-label="Bio" disabled placeholder="Unavailable" />
);
