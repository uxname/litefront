import type { Meta, StoryFn } from "@storybook/react-vite";
import { Input } from "./Input";

export default { component: Input } satisfies Meta<typeof Input>;

export const Default: StoryFn = () => <Input placeholder="Enter your name" />;

export const WithValue: StoryFn = () => (
  <Input defaultValue="hello@example.com" />
);

export const Invalid: StoryFn = () => (
  <Input invalid defaultValue="not-an-email" placeholder="Email" />
);

export const Disabled: StoryFn = () => (
  <Input disabled placeholder="Unavailable" />
);

export const Password: StoryFn = () => (
  <Input type="password" placeholder="Password" />
);

export const Email: StoryFn = () => (
  <Input type="email" placeholder="you@example.com" />
);
