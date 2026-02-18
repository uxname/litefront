import { useCounterStore } from "@entities/counter";
import { beforeEach, describe, expect, it } from "vitest";

describe("CounterStore", () => {
  beforeEach(() => {
    useCounterStore.setState({ counter: 0 });
  });

  it("should initialize with counter 0", () => {
    const state = useCounterStore.getState();
    expect(state.counter).toBe(0);
  });

  it("should increase counter", () => {
    const { increase } = useCounterStore.getState();
    increase();
    expect(useCounterStore.getState().counter).toBe(1);
  });

  it("should increase counter multiple times", () => {
    const { increase } = useCounterStore.getState();
    increase();
    increase();
    increase();
    expect(useCounterStore.getState().counter).toBe(3);
  });
});
