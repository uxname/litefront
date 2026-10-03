import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Button } from "./button";

afterEach(cleanup);

describe("Button", () => {
  it("is a plain button by default, so it never submits a form by accident", () => {
    const onSubmit = vi.fn((e: React.FormEvent) => e.preventDefault());
    render(
      <form onSubmit={onSubmit}>
        <Button>Click</Button>
      </form>,
    );
    const button = screen.getByRole("button", { name: "Click" });
    expect(button).toHaveAttribute("type", "button");
    button.click();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("submits when asked to", () => {
    render(<Button type="submit">Save</Button>);
    expect(screen.getByRole("button", { name: "Save" })).toHaveAttribute(
      "type",
      "submit",
    );
  });

  it("calls onClick, and not when disabled", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    const { rerender } = render(<Button onClick={onClick}>Go</Button>);
    await user.click(screen.getByRole("button", { name: "Go" }));
    expect(onClick).toHaveBeenCalledOnce();

    rerender(
      <Button onClick={onClick} disabled>
        Go
      </Button>,
    );
    expect(screen.getByRole("button", { name: "Go" })).toBeDisabled();
  });

  it("renders its child instead of a <button> with asChild, without a type", () => {
    render(
      <Button asChild variant="outline">
        <a href="/account">Account</a>
      </Button>,
    );
    const link = screen.getByRole("link", { name: "Account" });
    expect(link).toHaveAttribute("href", "/account");
    expect(link).not.toHaveAttribute("type");
    expect(link).toHaveAttribute("data-variant", "outline");
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("exposes its variant and size for styling hooks", () => {
    render(
      <Button variant="destructive" size="sm">
        Delete
      </Button>,
    );
    const button = screen.getByRole("button", { name: "Delete" });
    expect(button).toHaveAttribute("data-variant", "destructive");
    expect(button).toHaveAttribute("data-size", "sm");
  });
});
