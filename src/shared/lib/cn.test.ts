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

  it("resolves conflicting Tailwind spacing utilities in favour of the last one", () => {
    expect(cn("p-2", "p-4")).toBe("p-4");
  });

  it("resolves conflicting Tailwind colour utilities in favour of the last one", () => {
    expect(cn("text-red-500", "text-blue-500")).toBe("text-blue-500");
  });

  it("accepts the object syntax and keeps only the enabled keys", () => {
    expect(cn("base", { active: true, disabled: false })).toBe("base active");
  });

  it("accepts nested arrays", () => {
    expect(cn(["a", ["b", false]], "c")).toBe("a b c");
  });

  it("keeps daisyUI component classes that look alike but do not conflict", () => {
    expect(cn("btn", "btn-primary", "btn-lg")).toBe("btn btn-primary btn-lg");
  });
});
