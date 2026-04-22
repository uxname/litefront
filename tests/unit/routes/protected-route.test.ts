import { describe, expect, it, vi } from "vitest";

vi.mock("@pages/protected", () => ({ ProtectedPage: () => null }));

// Stub createFileRoute to extract route options without full router initialisation
vi.mock("@tanstack/react-router", async (importOriginal) => {
  const actual =
    await importOriginal<typeof import("@tanstack/react-router")>();
  return {
    ...actual,
    createFileRoute: () => (config: Record<string, unknown>) => ({
      options: config,
    }),
  };
});

import { Route } from "../../../src/routes/protected/index";

const beforeLoad = (
  Route as unknown as { options: { beforeLoad: (ctx: unknown) => void } }
).options.beforeLoad;

describe("Protected Route — beforeLoad guard", () => {
  it("throws when user is not authenticated", () => {
    expect(() => {
      beforeLoad({ context: { auth: { isAuthenticated: false } } });
    }).toThrow();
  });

  it('redirects to "/" when not authenticated', () => {
    let thrownValue: unknown;
    try {
      beforeLoad({ context: { auth: { isAuthenticated: false } } });
    } catch (e) {
      thrownValue = e;
    }
    // TanStack Router v1 redirect() throws a Response; destination is in options.to
    // biome-ignore lint/suspicious/noExplicitAny: thrown value has no exported type
    expect((thrownValue as any)?.options?.to).toBe("/");
  });

  it("does not throw when user is authenticated", () => {
    expect(() => {
      beforeLoad({ context: { auth: { isAuthenticated: true } } });
    }).not.toThrow();
  });
});
