import { beforeEach, describe, expect, it, vi } from "vitest";

const { captureException } = vi.hoisted(() => ({ captureException: vi.fn() }));
vi.mock("@shared/lib/sentry", () => ({ captureException }));

import { logError } from "./index";

describe("logError", () => {
  beforeEach(() => {
    captureException.mockClear();
  });

  // The whole point of the helper: Sentry is a no-op without a DSN baked in at
  // build time, so the console line is the only copy that always exists.
  it("always writes to the console, whatever Sentry does", () => {
    const consoleError = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});
    const error = new Error("boom");

    logError("graphql_error", error, { extra: { path: "/me" } });

    expect(consoleError).toHaveBeenCalledWith(
      "graphql_error",
      { path: "/me" },
      error,
    );
    consoleError.mockRestore();
  });

  it("also reports to Sentry with the given context", () => {
    const consoleError = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});
    const error = new Error("boom");
    const context = { tags: { source: "graphql" } };

    logError("graphql_error", error, context);

    expect(captureException).toHaveBeenCalledWith(error, context);
    consoleError.mockRestore();
  });
});
