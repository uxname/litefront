import type { Meta, StoryFn } from "@storybook/react-vite";
import { Input } from "./input";

export default { component: Input } satisfies Meta<typeof Input>;

export const Default: StoryFn = () => (
  <Input aria-label="Name" placeholder="Enter your name" />
);

export const WithValue: StoryFn = () => (
  <Input aria-label="Email" defaultValue="hello@example.com" />
);

export const Invalid: StoryFn = () => (
  <Input aria-label="Email" aria-invalid defaultValue="not-an-email" />
);

export const Disabled: StoryFn = () => (
  <Input aria-label="Name" disabled placeholder="Unavailable" />
);

export const File: StoryFn = () => <Input aria-label="Picture" type="file" />;
