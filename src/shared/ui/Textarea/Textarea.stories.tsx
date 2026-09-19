import type { Meta, StoryFn } from "@storybook/react-vite";
import { Textarea } from "./Textarea";

export default { component: Textarea } satisfies Meta<typeof Textarea>;

export const Default: StoryFn = () => (
  <Textarea placeholder="Write your message…" />
);

export const WithValue: StoryFn = () => (
  <Textarea defaultValue="The quick brown fox jumps over the lazy dog." />
);

export const Invalid: StoryFn = () => (
  <Textarea invalid defaultValue="This value is not allowed." />
);

export const Disabled: StoryFn = () => (
  <Textarea disabled defaultValue="You cannot edit this." />
);

export const CustomRows: StoryFn = () => (
  <Textarea rows={10} placeholder="A taller textarea (10 rows)…" />
);

export const ReadOnly: StoryFn = () => (
  <Textarea readOnly defaultValue="Read-only content." />
);
