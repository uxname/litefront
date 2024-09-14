import { Story, StoryDefault } from "@ladle/react";

import { Counter as CounterComponent, ICounterProperties } from "./index.tsx";

export default {
  title: "Counter",
} satisfies StoryDefault;

export const Default: Story = () => <CounterComponent />;

export const Configurable: Story<ICounterProperties> = ({ title }) => (
  <CounterComponent title={title} />
);
Configurable.args = { title: "Counter custom title" };
