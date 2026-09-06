import type { Story } from "@ladle/react";
import { ArrowRight, Mail } from "lucide-react";
import { Button } from "./Button";

export const Primary: Story = () => (
  <Button className="shadow-sm">Primary action</Button>
);

export const Ghost: Story = () => <Button variant="ghost">Ghost</Button>;

export const Danger: Story = () => <Button variant="danger">Delete</Button>;

export const DangerSolid: Story = () => (
  <Button variant="danger-solid" className="shadow-sm">
    Crash the app
  </Button>
);

export const Sizes: Story = () => (
  <div className="flex items-center gap-3">
    <Button size="sm">Small</Button>
    <Button size="md">Medium</Button>
    <Button size="lg">Large CTA</Button>
  </div>
);

export const Loading: Story = () => <Button loading>Saving…</Button>;

export const WithLeftIcon: Story = () => (
  <Button leftIcon={<Mail className="h-4 w-4" />}>Email</Button>
);

export const WithRightIcon: Story = () => (
  <Button rightIcon={<ArrowRight className="h-4 w-4" />}>Continue</Button>
);

export const Disabled: Story = () => <Button disabled>Unavailable</Button>;
