import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderToString } from "react-dom/server";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ErrorFallback } from "./ErrorFallback";

afterEach(cleanup);

describe("ErrorFallback", () => {
  it("renders the auth title for an auth-like error", () => {
    render(<ErrorFallback error={new Error("401 unauthorized")} />);
    // The global paraglide mock echoes each message key as its literal string.
    expect(
      screen.getByRole("heading", { name: "error_auth_required" }),
    ).toBeInTheDocument();
  });

  it("reveals the pathname when the details toggle is clicked", async () => {
    const user = userEvent.setup();
    render(
      <ErrorFallback
        error={new Error("boom")}
        pathname="/dashboard/settings"
      />,
    );

    // Path is hidden until details are expanded.
    expect(screen.queryByText("/dashboard/settings")).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /dev_details/ }));

    expect(screen.getByText("/dashboard/settings")).toBeInTheDocument();
  });

  it("invokes onRetry when the retry button is pressed", async () => {
    const user = userEvent.setup();
    const onRetry = vi.fn();
    render(<ErrorFallback error={new Error("boom")} onRetry={onRetry} />);

    await user.click(screen.getByRole("button", { name: /action_retry/ }));

    expect(onRetry).toHaveBeenCalledOnce();
  });
});

describe("ErrorFallback without an explicit pathname", () => {
  it("falls back to the current path in the browser", async () => {
    const user = userEvent.setup();
    render(<ErrorFallback error={new Error("boom")} />);
    await user.click(screen.getByRole("button", { name: /dev_details/ }));
    // jsdom's default location; the point is that the default resolved to something.
    expect(screen.getByText(window.location.pathname)).toBeInTheDocument();
  });

  it("server-renders without touching window (SSR)", () => {
    // This component IS the error fallback, and the tree is server-rendered
    // (`defaultSsr: true`). Reading `window` while rendering made the boundary throw
    // from its own fallback, turning a handled error into a bare 500 — so the default
    // must survive `window` being absent. Uses the server renderer, not
    // testing-library: the latter needs a DOM and would throw on its own.
    const realWindow = globalThis.window;
    // @ts-expect-error — deliberately simulating a server environment
    delete globalThis.window;
    try {
      expect(() =>
        renderToString(<ErrorFallback error={new Error("boom")} />),
      ).not.toThrow();
    } finally {
      globalThis.window = realWindow;
    }
  });
});
