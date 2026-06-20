import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
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
