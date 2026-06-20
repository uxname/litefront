import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { Toaster, toast } from "./Toaster";

// jsdom does not implement the Pointer Capture API. Sonner calls
// setPointerCapture on a toast's pointerdown, so stub it (and its pair) to keep
// userEvent pointer interactions from throwing an unhandled error.
beforeAll(() => {
  if (!HTMLElement.prototype.setPointerCapture) {
    HTMLElement.prototype.setPointerCapture = vi.fn();
    HTMLElement.prototype.releasePointerCapture = vi.fn();
    HTMLElement.prototype.hasPointerCapture = vi.fn(() => false);
  }
});

afterEach(() => {
  // Sonner keeps a module-global toast queue, so explicitly clear it between
  // tests before unmounting to prevent toasts leaking across cases.
  toast.dismiss();
  cleanup();
});

describe("Toaster", () => {
  it("re-exports the sonner toast function", () => {
    expect(typeof toast).toBe("function");
  });

  it("renders the polite live-region container without any toasts", () => {
    render(<Toaster />);
    const region = screen.getByLabelText(/Notifications/i);
    expect(region.tagName).toBe("SECTION");
    expect(region).toHaveAttribute("aria-live", "polite");
  });

  it("does not render the toast list until a toast is shown", () => {
    const { container } = render(<Toaster />);
    expect(container.querySelector("[data-sonner-toaster]")).toBeNull();
  });

  it("renders a fired toast's message", async () => {
    render(<Toaster />);
    toast("Saved your changes");
    expect(await screen.findByText("Saved your changes")).toBeInTheDocument();
  });

  it("applies the toaster className to the list once a toast appears", async () => {
    const { container } = render(<Toaster />);
    toast("Hello");
    await screen.findByText("Hello");
    const list = container.querySelector<HTMLElement>("[data-sonner-toaster]");
    expect(list).not.toBeNull();
    expect(list).toHaveClass("toaster", "group");
  });

  it("defaults the list to the bottom-right position", async () => {
    const { container } = render(<Toaster />);
    toast("Positioned");
    await screen.findByText("Positioned");
    const list = container.querySelector("[data-sonner-toaster]");
    expect(list).toHaveAttribute("data-y-position", "bottom");
    expect(list).toHaveAttribute("data-x-position", "right");
  });

  it("honours an overridden position prop", async () => {
    const { container } = render(<Toaster position="top-center" />);
    toast("Top centered");
    await screen.findByText("Top centered");
    const list = container.querySelector("[data-sonner-toaster]");
    expect(list).toHaveAttribute("data-y-position", "top");
    expect(list).toHaveAttribute("data-x-position", "center");
  });

  it("uses the light theme by default", async () => {
    const { container } = render(<Toaster />);
    toast("Themed");
    await screen.findByText("Themed");
    const list = container.querySelector("[data-sonner-toaster]");
    expect(list).toHaveAttribute("data-sonner-theme", "light");
  });

  it("respects a theme override", async () => {
    const { container } = render(<Toaster theme="dark" />);
    toast("Dark");
    await screen.findByText("Dark");
    const list = container.querySelector("[data-sonner-toaster]");
    expect(list).toHaveAttribute("data-sonner-theme", "dark");
  });

  it("renders a success toast with the success type", async () => {
    const { container } = render(<Toaster />);
    toast.success("Profile updated");
    await screen.findByText("Profile updated");
    expect(
      container.querySelector('[data-sonner-toast][data-type="success"]'),
    ).not.toBeNull();
  });

  it("renders an error toast with the error type", async () => {
    const { container } = render(<Toaster />);
    toast.error("Something went wrong");
    await screen.findByText("Something went wrong");
    expect(
      container.querySelector('[data-sonner-toast][data-type="error"]'),
    ).not.toBeNull();
  });

  it("renders a toast description alongside its title", async () => {
    render(<Toaster />);
    toast("Heads up", { description: "More details here" });
    expect(await screen.findByText("Heads up")).toBeInTheDocument();
    expect(screen.getByText("More details here")).toBeInTheDocument();
  });

  it("renders an action button and invokes its handler on click", async () => {
    const user = userEvent.setup();
    const onAction = vi.fn();
    render(<Toaster />);
    toast("Item deleted", {
      action: { label: "Undo", onClick: onAction },
    });
    const actionButton = await screen.findByRole("button", { name: "Undo" });
    await user.click(actionButton);
    expect(onAction).toHaveBeenCalledOnce();
  });

  it("renders a close button when closeButton is enabled", async () => {
    const { container } = render(<Toaster closeButton />);
    toast("Closable");
    await screen.findByText("Closable");
    const list = container.querySelector<HTMLElement>("[data-sonner-toaster]");
    expect(list).not.toBeNull();
    expect(
      within(list as HTMLElement).getByLabelText("Close toast"),
    ).toBeInTheDocument();
  });

  it("forwards an arbitrary prop onto the underlying container label", () => {
    render(<Toaster containerAriaLabel="Alerts" />);
    expect(screen.getByLabelText(/Alerts/i)).toBeInTheDocument();
  });
});
