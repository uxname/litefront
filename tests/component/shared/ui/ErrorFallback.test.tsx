import { ErrorFallback } from "@shared/ui/ErrorFallback";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

// Local mock takes precedence over the global setup.ts mock — kept for self-containedness
vi.mock("@generated/paraglide/messages", () => ({
  m: {
    error_generic_title: () => "System Issue",
    error_unexpected: () => "Unexpected Error",
    error_unexpected_desc: () => "An unexpected error occurred",
    error_auth_required: () => "Authentication Required",
    error_auth_desc: () => "Please sign in to continue",
    error_access_denied: () => "Access Denied",
    error_access_desc: () => "You do not have permission",
    error_network: () => "Network Error",
    error_network_desc: () => "Please check your connection",
    error_server: () => "Server Error",
    error_server_desc: () => "The server encountered an error",
    action_retry: () => "Retry",
    action_reload: () => "Reload",
    dev_details: () => "Developer Details",
  },
}));

describe("ErrorFallback", () => {
  it("displays error message in developer details", () => {
    const error = new Error("Test error message");
    render(<ErrorFallback error={error} reset={vi.fn()} />);

    fireEvent.click(screen.getByRole("button", { name: /developer details/i }));

    const errorMessages = screen.getAllByText(/test error message/i);
    expect(errorMessages.length).toBeGreaterThanOrEqual(1);
  });

  it("calls reset when retry button clicked", () => {
    const reset = vi.fn();
    render(<ErrorFallback error={new Error("Test error")} reset={reset} />);

    fireEvent.click(screen.getByRole("button", { name: /retry/i }));
    expect(reset).toHaveBeenCalled();
  });

  it("shows AUTH title for 401 errors", () => {
    render(<ErrorFallback error={new Error("401 Unauthorized")} />);
    expect(
      screen.getByRole("heading", { name: "Authentication Required" }),
    ).toBeInTheDocument();
  });

  it("shows ACCESS title for 403 errors", () => {
    render(<ErrorFallback error={new Error("Forbidden 403")} />);
    expect(
      screen.getByRole("heading", { name: "Access Denied" }),
    ).toBeInTheDocument();
  });

  it("shows NETWORK title for network errors", () => {
    render(
      <ErrorFallback error={new Error("Network Error (Failed to fetch)")} />,
    );
    expect(
      screen.getByRole("heading", { name: "Network Error" }),
    ).toBeInTheDocument();
  });

  it("shows SERVER title for 500 errors", () => {
    render(<ErrorFallback error={new Error("Internal Server Error 500")} />);
    expect(
      screen.getByRole("heading", { name: "Server Error" }),
    ).toBeInTheDocument();
  });

  it("shows UNKNOWN title for unrecognised errors", () => {
    render(<ErrorFallback error={new Error("Some strange bug")} />);
    expect(
      screen.getByRole("heading", { name: "Unexpected Error" }),
    ).toBeInTheDocument();
  });

  it("renders retry and reload buttons", () => {
    render(<ErrorFallback error={new Error("Error")} reset={vi.fn()} />);
    expect(screen.getByRole("button", { name: /retry/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /reload/i })).toBeInTheDocument();
  });
});
