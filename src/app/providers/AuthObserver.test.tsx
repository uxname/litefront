import { cleanup, render } from "@testing-library/react";
import { useAuth } from "react-oidc-context";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { AuthObserver } from "./AuthObserver";

// Sentry is a thin re-export of the SDK; a no-op spy is enough to assert the
// observability wiring without pulling in the real client.
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

  it("sets the Sentry user from the OIDC profile when logged in", () => {
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
    expect(setUser).toHaveBeenCalledWith({
      id: "user-1",
      email: "jane@example.com",
      username: "jane",
    });
  });

  it("clears the Sentry user when logged out", () => {
    render(<AuthObserver />);
    expect(setUser).toHaveBeenCalledWith(null);
  });

  it("reports an OIDC error to Sentry", () => {
    const error = new Error("oidc boom");
    mockedUseAuth.mockReturnValue({ ...baseAuth, error } as never);
    render(<AuthObserver />);
    expect(captureException).toHaveBeenCalledWith(error);
  });

  it("subscribes to silent-renew errors and forwards them to Sentry", () => {
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

    const renewError = new Error("renew failed");
    registered?.(renewError);
    expect(captureException).toHaveBeenCalledWith(renewError);

    unmount();
    expect(removeSilentRenewError).toHaveBeenCalledOnce();
  });
});
