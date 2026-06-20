import { describe, expect, it } from "vitest";
import { cn } from "./cn";

describe("cn", () => {
  it("joins multiple truthy parts with a single space", () => {
    expect(cn("a", "b", "c")).toBe("a b c");
  });

  it("returns a single part unchanged", () => {
    expect(cn("solo")).toBe("solo");
  });

  it("drops false, null and undefined parts", () => {
    expect(cn("a", false, "b", null, "c", undefined)).toBe("a b c");
  });

  it("returns an empty string when every part is falsy", () => {
    expect(cn(false, null, undefined)).toBe("");
  });

  it("returns an empty string with no arguments", () => {
    expect(cn()).toBe("");
  });

  it("keeps only the truthy class from a conditional expression", () => {
    const active = false;
    const visible = true;
    expect(cn("base", active && "active", visible && "visible")).toBe(
      "base visible",
    );
  });
});
