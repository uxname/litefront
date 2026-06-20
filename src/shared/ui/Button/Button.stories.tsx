import type { Story } from "@ladle/react";
import { Mail } from "lucide-react";
import { Button } from "./Button";

export const Primary: Story = () => <Button>Primary action</Button>;

export const Ghost: Story = () => <Button variant="ghost">Ghost</Button>;

export const Danger: Story = () => <Button variant="danger">Delete</Button>;

export const Sizes: Story = () => (
  <div className="flex items-center gap-3">
    <Button size="sm">Small</Button>
    <Button size="md">Medium</Button>
  </div>
);

export const Loading: Story = () => <Button loading>Saving…</Button>;

export const WithLeftIcon: Story = () => (
  <Button leftIcon={<Mail className="h-4 w-4" />}>Email</Button>
);

export const Disabled: Story = () => <Button disabled>Unavailable</Button>;
