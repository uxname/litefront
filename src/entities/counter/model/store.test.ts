import { beforeEach, describe, expect, it } from "vitest";
import { useCounterStore } from "./store";

beforeEach(() => {
  useCounterStore.setState({ counter: 0 });
});

describe("useCounterStore", () => {
  it("starts with a counter of 0", () => {
    expect(useCounterStore.getState().counter).toBe(0);
  });

  it("increments the counter by one when increase is called", () => {
    useCounterStore.getState().increase();
    expect(useCounterStore.getState().counter).toBe(1);
  });

  it("increments cumulatively across multiple calls", () => {
    const { increase } = useCounterStore.getState();
    increase();
    increase();
    increase();
    expect(useCounterStore.getState().counter).toBe(3);
  });
});
