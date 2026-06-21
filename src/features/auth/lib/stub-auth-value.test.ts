import { describe, expect, it } from "vitest";
import { createStubAuthValue } from "./stub-auth-value";

/** Recursively invoke every function reachable from `obj` (no-op stubs). */
const invokeAll = (obj: unknown): void => {
  if (typeof obj === "function") {
    // The stub methods are no-ops; some return a promise we don't await.
    void (obj as (...args: unknown[]) => unknown)();
    return;
  }
  if (obj && typeof obj === "object") {
    for (const value of Object.values(obj)) invokeAll(value);
  }
};

describe("createStubAuthValue", () => {
  it("returns a settled, logged-out context by default", () => {
    const value = createStubAuthValue();

    expect(value.isAuthenticated).toBe(false);
    expect(value.isLoading).toBe(false);
    expect(value.user).toBeUndefined();
    expect(value.error).toBeUndefined();
    expect(value.activeNavigator).toBeUndefined();
  });

  it("exposes callable no-op methods (including the events bag)", () => {
    const value = createStubAuthValue();

    // Smoke-test that every method (top-level + events) is callable and safe.
    expect(() => invokeAll(value)).not.toThrow();
    expect(typeof value.signinRedirect).toBe("function");
    expect(typeof value.events.addUserLoaded).toBe("function");
  });

  it("applies overrides over the defaults", () => {
    const signoutRedirect = async () => {};
    const value = createStubAuthValue({
      isAuthenticated: true,
      signoutRedirect,
    });

    expect(value.isAuthenticated).toBe(true);
    expect(value.signoutRedirect).toBe(signoutRedirect);
    // Untouched defaults remain in place.
    expect(value.isLoading).toBe(false);
  });
});
