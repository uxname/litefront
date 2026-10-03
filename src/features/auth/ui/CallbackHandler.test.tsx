import { act, cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useAuth } from "react-oidc-context";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { CALLBACK_TIMEOUT_MS, CallbackHandler } from "./CallbackHandler";

vi.mock("@shared/lib/sentry", () => ({ captureMessage: vi.fn() }));

const mockedUseAuth = vi.mocked(useAuth);
const signinRedirect = vi.fn();

beforeEach(() => {
  mockedUseAuth.mockReturnValue({ signinRedirect, error: undefined } as never);
});

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

describe("CallbackHandler", () => {
  it("shows a loader while the code exchange runs", () => {
    render(<CallbackHandler />);
    expect(
      screen.getByRole("status", { name: "auth_verifying" }),
    ).toBeInTheDocument();
  });

  it("shows the failure and a way to start over when the exchange fails", async () => {
    const user = userEvent.setup();
    mockedUseAuth.mockReturnValue({
      signinRedirect,
      error: new Error("invalid_grant"),
    } as never);
    render(<CallbackHandler />);

    expect(
      screen.getByRole("heading", { name: "auth_callback_error_title" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("alert")).toHaveTextContent("invalid_grant");

    await user.click(screen.getByRole("button", { name: "auth_sign_in" }));
    expect(signinRedirect).toHaveBeenCalledOnce();
  });

  it("gives up waiting after the timeout instead of spinning forever", () => {
    vi.useFakeTimers();
    render(<CallbackHandler />);
    act(() => {
      vi.advanceTimersByTime(CALLBACK_TIMEOUT_MS);
    });
    expect(
      screen.getByRole("heading", { name: "auth_callback_error_title" }),
    ).toBeInTheDocument();
  });
});
