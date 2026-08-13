import { describe, expect, it, vi } from "vitest";

// vi.hoisted: the mock factories run before the imports they replace.
// `captureServerException` — the Node SDK opens a real transport on import, and a
// spy is enough to assert the catch path reports the failure. `render` stands in
// for the handler `createStartHandler` builds, so the render can be made to fail
// on demand without booting the router.
const { captureServerException, render } = vi.hoisted(() => ({
  captureServerException: vi.fn(),
  render: vi.fn(),
}));

vi.mock("@shared/lib/sentry/server", () => ({ captureServerException }));
vi.mock("@tanstack/react-start/server", () => ({
  createStartHandler: () => render,
  defaultStreamHandler: {},
}));

vi.mock("./generated/paraglide/runtime", () => ({
  cookieName: "PARAGLIDE_LOCALE",
}));
vi.mock("./generated/paraglide/server", () => ({
  paraglideMiddleware: (
    request: Request,
    resolve: (args: { request: Request; locale: string }) => Promise<Response>,
  ) => resolve({ request, locale: "en" }),
}));

import server from "./server";

describe("SSR request handler", () => {
  it("reports a failed render to Sentry and still answers 500", async () => {
    const error = new Error("render exploded");
    render.mockRejectedValueOnce(error);
    const consoleError = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    const response = await server.fetch(new Request("http://localhost/"));

    expect(response.status).toBe(500);
    expect(captureServerException).toHaveBeenCalledWith(error);
    expect(consoleError).toHaveBeenCalled();
    consoleError.mockRestore();
  });

  it("reports nothing when the render succeeds", async () => {
    render.mockResolvedValueOnce(new Response('<html lang="en"></html>'));

    const response = await server.fetch(new Request("http://localhost/"));

    expect(response.status).toBe(200);
    expect(captureServerException).not.toHaveBeenCalled();
  });
});
