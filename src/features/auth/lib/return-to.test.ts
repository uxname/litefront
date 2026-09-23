import { describe, expect, it } from "vitest";
import { safeReturnTo } from "./return-to";

describe("safeReturnTo", () => {
  it("keeps an in-app path", () => {
    expect(safeReturnTo("/account?tab=1#top")).toBe("/account?tab=1#top");
  });

  // The value comes from the app's own OIDC state today, and the browser's
  // same-origin rule on replaceState would stop a foreign URL — but the
  // invariant belongs here, not in browser policy.
  it.each([
    "//evil.example/x",
    "/\\evil.example",
    "https://evil.example/",
    "javascript:alert(1)",
    "account",
    "",
    // The URL parser drops tabs and newlines, so these become //evil.example.
    "/\t/evil.example",
    "/\n/evil.example",
  ])("sends %j home instead", (value) => {
    expect(safeReturnTo(value)).toBe("/");
  });

  it("sends a non-string home", () => {
    expect(safeReturnTo(undefined)).toBe("/");
    expect(safeReturnTo(42)).toBe("/");
  });
});
