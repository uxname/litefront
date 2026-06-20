import type { Story } from "@ladle/react";
import { Textarea } from "./Textarea";

export const Default: Story = () => (
  <Textarea placeholder="Write your message…" />
);

export const WithValue: Story = () => (
  <Textarea defaultValue="The quick brown fox jumps over the lazy dog." />
);

export const Invalid: Story = () => (
  <Textarea invalid defaultValue="This value is not allowed." />
);

export const Disabled: Story = () => (
  <Textarea disabled defaultValue="You cannot edit this." />
);

export const CustomRows: Story = () => (
  <Textarea rows={10} placeholder="A taller textarea (10 rows)…" />
);

export const ReadOnly: Story = () => (
  <Textarea readOnly defaultValue="Read-only content." />
);
