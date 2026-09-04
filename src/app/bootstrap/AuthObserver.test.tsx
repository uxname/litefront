import { cleanup, render } from "@testing-library/react";
import { useAuth } from "react-oidc-context";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { AuthObserver } from "./AuthObserver";

// Sentry is a thin re-export of the SDK; a no-op spy is enough to assert the
// observability wiring without pulling in the real client. `logError` reports
// through it, so spying here covers both the console line and the Sentry copy.
const { setUser, captureException } = vi.hoisted(() => ({
  setUser: vi.fn(),
  captureException: vi.fn(),
}));
vi.mock("@shared/lib/sentry", () => ({ setUser, captureException }));

const mockedUseAuth = vi.mocked(useAuth);

const baseAuth = {
  isAuthenticated: false,
  isLoading: false,
  user: null,
  error: undefined,
  events: undefined,
};

afterEach(cleanup);
beforeEach(() => {
  vi.clearAllMocks();
  mockedUseAuth.mockReturnValue(baseAuth as never);
});

describe("AuthObserver", () => {
  it("renders no markup", () => {
    const { container } = render(<AuthObserver />);
    expect(container).toBeEmptyDOMElement();
  });

  it("sets the Sentry user to the subject only (no PII) when logged in", () => {
    mockedUseAuth.mockReturnValue({
      ...baseAuth,
      user: {
        profile: {
          sub: "user-1",
          email: "jane@example.com",
          preferred_username: "jane",
        },
      },
    } as never);
    render(<AuthObserver />);
    // Only the opaque subject is sent — email/username PII must not be forwarded.
    expect(setUser).toHaveBeenCalledWith({ id: "user-1" });
  });

  it("clears the Sentry user when logged out", () => {
    render(<AuthObserver />);
    expect(setUser).toHaveBeenCalledWith(null);
  });

  // react-oidc-context never throws these, so the global boundary cannot see
  // them: this component is the only thing that reports them at all.
  it("reports an OIDC error", () => {
    const consoleError = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});
    const error = new Error("oidc boom");
    mockedUseAuth.mockReturnValue({ ...baseAuth, error } as never);

    render(<AuthObserver />);

    expect(consoleError).toHaveBeenCalledWith("auth_error", {}, error);
    expect(captureException).toHaveBeenCalledWith(error, undefined);
    consoleError.mockRestore();
  });

  it("subscribes to silent-renew errors and reports them", () => {
    let registered: ((e: Error) => void) | undefined;
    const addSilentRenewError = vi.fn((cb: (e: Error) => void) => {
      registered = cb;
    });
    const removeSilentRenewError = vi.fn();
    mockedUseAuth.mockReturnValue({
      ...baseAuth,
      events: { addSilentRenewError, removeSilentRenewError },
    } as never);

    const { unmount } = render(<AuthObserver />);
    expect(addSilentRenewError).toHaveBeenCalledOnce();

    const consoleError = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});
    const renewError = new Error("renew failed");
    registered?.(renewError);
    expect(consoleError).toHaveBeenCalledWith(
      "auth_silent_renew_failed",
      {},
      renewError,
    );
    expect(captureException).toHaveBeenCalledWith(renewError, undefined);
    consoleError.mockRestore();

    unmount();
    expect(removeSilentRenewError).toHaveBeenCalledOnce();
  });
});
