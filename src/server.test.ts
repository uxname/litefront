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

// `cookieMaxAge` is deliberately not Paraglide's real number: the assertion below
// proves the server takes the lifetime FROM the runtime, so the cookie it sets and
// the one `setLocale` writes in the browser can never disagree again.
vi.mock("./generated/paraglide/runtime", () => ({
  cookieName: "PARAGLIDE_LOCALE",
  cookieMaxAge: 1234,
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

    const response = await server.fetch(
      new Request("http://localhost/account?token=secret", {
        method: "POST",
      }),
    );

    expect(response.status).toBe(500);
    expect(captureServerException).toHaveBeenCalledWith(error);
    // The container log must say *what* failed: a bare "render failed" line
    // leaves an operator with a 500 and no route.
    expect(consoleError).toHaveBeenCalledWith("ssr_render_failed", {
      method: "POST",
      path: "/account",
      error,
    });
    consoleError.mockRestore();
  });

  it("reports nothing when the render succeeds", async () => {
    render.mockResolvedValueOnce(new Response('<html lang="en"></html>'));

    const response = await server.fetch(new Request("http://localhost/"));

    expect(response.status).toBe(200);
    expect(captureServerException).not.toHaveBeenCalled();
  });

  it("persists the resolved locale on a first visit, for as long as Paraglide does", async () => {
    render.mockResolvedValueOnce(new Response("<html></html>"));

    const response = await server.fetch(new Request("http://localhost/"));

    expect(response.headers.get("Set-Cookie")).toBe(
      "PARAGLIDE_LOCALE=en; Path=/; Max-Age=1234; SameSite=Lax",
    );
  });

  it("leaves an existing locale cookie alone", async () => {
    render.mockResolvedValueOnce(new Response("<html></html>"));

    const response = await server.fetch(
      new Request("http://localhost/", {
        headers: { cookie: "PARAGLIDE_LOCALE=ru" },
      }),
    );

    expect(response.headers.get("Set-Cookie")).toBeNull();
  });

  // The policy's nonce must be the one the render stamps on its inline
  // scripts: the server hands it to the render on an internal request header,
  // which a client can never set for itself.
  it("serves a per-request nonce policy and hands the same nonce to the render", async () => {
    const seen: (string | null)[] = [];
    render.mockImplementation(async (req: Request) => {
      seen.push(req.headers.get("x-litefront-csp-nonce"));
      return new Response("<html></html>");
    });
    const policyOf = (r: Response) =>
      r.headers.get("Content-Security-Policy") ??
      r.headers.get("Content-Security-Policy-Report-Only") ??
      "";

    const first = await server.fetch(
      new Request("http://localhost/", {
        headers: { "x-litefront-csp-nonce": "chosen-by-attacker" },
      }),
    );
    const second = await server.fetch(new Request("http://localhost/"));

    expect(seen[0]).not.toBe("chosen-by-attacker");
    expect(policyOf(first)).toContain(`'nonce-${seen[0]}'`);
    expect(policyOf(second)).toContain(`'nonce-${seen[1]}'`);
    expect(seen[0]).not.toBe(seen[1]);
    render.mockReset();
  });

  // Every SSR page is unique per request (its CSP nonce) and varies by locale
  // cookie and Accept-Language; a shared cache must never store or replay it.
  it("keeps server-rendered pages out of shared caches", async () => {
    render.mockResolvedValueOnce(new Response("<html></html>"));

    const response = await server.fetch(new Request("http://localhost/"));

    expect(response.headers.get("Cache-Control")).toBe("no-store");
    expect(response.headers.get("Vary")).toBe("Cookie, Accept-Language");
  });
});
