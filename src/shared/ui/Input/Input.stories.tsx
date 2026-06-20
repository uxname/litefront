import type { Story } from "@ladle/react";
import { Input } from "./Input";

export const Default: Story = () => <Input placeholder="Enter your name" />;

export const WithValue: Story = () => (
  <Input defaultValue="hello@example.com" />
);

export const Invalid: Story = () => (
  <Input invalid defaultValue="not-an-email" placeholder="Email" />
);

export const Disabled: Story = () => (
  <Input disabled placeholder="Unavailable" />
);

export const Password: Story = () => (
  <Input type="password" placeholder="Password" />
);

export const Email: Story = () => (
  <Input type="email" placeholder="you@example.com" />
);
