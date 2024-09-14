import { Story } from "@ladle/react";

import { Counter as CounterComponent, ICounterProperties } from "./index.tsx";

export const Counter: Story<ICounterProperties> = ({ title }) => (
  <CounterComponent title={title} />
);
Counter.args = {
  title: "Counter",
};
