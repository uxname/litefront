import { Counter, useCounterStore } from "@entities/counter";
import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

// Mock the toast
vi.mock("@shared/ui/Toaster", () => ({
  toast: {
    success: vi.fn(),
  },
}));

describe("Counter Component", () => {
  beforeEach(() => {
    useCounterStore.setState({ counter: 0 });
  });

  it("renders with initial counter 0", () => {
    render(<Counter />);
    expect(screen.getByText("0")).toBeInTheDocument();
  });

  it("increments when button clicked", () => {
    render(<Counter />);
    const button = screen.getByRole("button", { name: /increment/i });
    fireEvent.click(button);
    expect(screen.getByText("1")).toBeInTheDocument();
  });

  it("displays custom title when provided", () => {
    render(<Counter title="Custom Title" />);
    expect(screen.getByText("Custom Title")).toBeInTheDocument();
  });
});
