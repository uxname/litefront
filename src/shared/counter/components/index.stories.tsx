import { Story, StoryDefault } from "@ladle/react";

import { Counter as CounterComponent, CounterProps } from "./index.tsx";

export default {
  title: "Counter",
} satisfies StoryDefault;

export const Default: Story = () => <CounterComponent />;

export const Configurable: Story<CounterProps> = ({ title }) => (
  <CounterComponent title={title} />
);
Configurable.args = { title: "Counter custom title" };
