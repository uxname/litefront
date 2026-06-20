import { describe, expect, it } from "vitest";
import { normalizeError } from "./normalizeError";

describe("normalizeError", () => {
  it("passes an Error instance through unchanged", () => {
    const original = new Error("boom");
    expect(normalizeError(original)).toBe(original);
  });

  it("wraps a string input in an Error", () => {
    const result = normalizeError("plain string failure");
    expect(result).toBeInstanceOf(Error);
    expect(result.message).toBe("plain string failure");
  });

  it("JSON-stringifies a plain-object input", () => {
    const result = normalizeError({ code: 42, reason: "nope" });
    expect(result).toBeInstanceOf(Error);
    expect(result.message).toBe('{"code":42,"reason":"nope"}');
  });

  it("uses the default message when serialization yields an empty string", () => {
    // JSON.stringify(undefined) returns undefined, so message falls back.
    const result = normalizeError(undefined);
    expect(result.message).toBe("Unknown error occurred");
  });

  it("falls back for a non-serializable circular-reference object", () => {
    const circular: Record<string, unknown> = {};
    circular.self = circular;
    const result = normalizeError(circular);
    expect(result.message).toBe("Non-serializable error (circular or BigInt)");
  });

  it("falls back for a BigInt input that JSON.stringify cannot serialize", () => {
    const result = normalizeError(10n);
    expect(result.message).toBe("Non-serializable error (circular or BigInt)");
  });
});
