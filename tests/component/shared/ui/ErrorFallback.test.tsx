import { ErrorFallback } from "@shared/ui/ErrorFallback";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

// Mock paraglide messages
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
  it("displays error message", () => {
    const error = new Error("Test error message");
    render(<ErrorFallback error={error} reset={vi.fn()} />);

    // Click to expand developer details to see error message
    const detailsButton = screen.getByRole("button", {
      name: /developer details/i,
    });
    fireEvent.click(detailsButton);

    // Error message appears in both title and stack trace
    const errorMessages = screen.getAllByText(/test error message/i);
    expect(errorMessages.length).toBeGreaterThanOrEqual(1);
  });

  it("calls reset when retry button clicked", () => {
    const reset = vi.fn();
    const error = new Error("Test error");

    render(<ErrorFallback error={error} reset={reset} />);

    const retryButton = screen.getByRole("button", { name: /retry/i });
    fireEvent.click(retryButton);

    expect(reset).toHaveBeenCalled();
  });
});
