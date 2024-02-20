// sum.test.js
import { expect, test } from "vitest";

function sum(a: number, b: number): number {
  return a + b;
}

test("adds 1 + 2 to equal 3", () => {
  // eslint-disable-next-line no-magic-numbers
  expect(sum(1, 2)).toBe(3);
});
