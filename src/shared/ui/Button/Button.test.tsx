import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Button } from "./Button";

afterEach(cleanup);

describe("Button", () => {
  it("renders its children", () => {
    render(<Button>Click me</Button>);
    expect(
      screen.getByRole("button", { name: "Click me" }),
    ).toBeInTheDocument();
  });

  it("defaults to type=button (never submits a form implicitly)", () => {
    render(<Button>Go</Button>);
    expect(screen.getByRole("button")).toHaveAttribute("type", "button");
  });

  it("honours an explicit type", () => {
    render(<Button type="submit">Save</Button>);
    expect(screen.getByRole("button")).toHaveAttribute("type", "submit");
  });

  it("calls onClick when pressed", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Press</Button>);
    await user.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("is disabled while loading and does not fire onClick", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <Button loading onClick={onClick}>
        Saving
      </Button>,
    );
    const btn = screen.getByRole("button");
    expect(btn).toBeDisabled();
    await user.click(btn);
    expect(onClick).not.toHaveBeenCalled();
  });

  it("does not fire onClick when disabled", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <Button disabled onClick={onClick}>
        Nope
      </Button>,
    );
    await user.click(screen.getByRole("button"));
    expect(onClick).not.toHaveBeenCalled();
  });

  it("renders a left icon when not loading", () => {
    render(<Button leftIcon={<span data-testid="icon" />}>Has icon</Button>);
    expect(screen.getByTestId("icon")).toBeInTheDocument();
  });

  it("merges a custom className with the variant classes", () => {
    render(<Button className="custom-x">X</Button>);
    expect(screen.getByRole("button")).toHaveClass("custom-x");
  });

  it("forwards a ref to the underlying button element", () => {
    const ref = createRef<HTMLButtonElement>();
    render(<Button ref={ref}>Ref</Button>);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });
  it("renders a right icon after the children (left icon stays before)", () => {
    render(
      <Button leftIcon={<span>L</span>} rightIcon={<span>R</span>}>
        mid
      </Button>,
    );
    expect(screen.getByRole("button").textContent).toBe("LmidR");
  });

  it("size=lg is a large CTA: px-8, py-4 and a rounder corner", () => {
    render(<Button size="lg">Big</Button>);
    expect(screen.getByRole("button")).toHaveClass(
      "px-8",
      "py-4",
      "rounded-2xl",
    );
  });

  it("size=md keeps its old classes (no existing call site changes)", () => {
    render(<Button size="md">Medium</Button>);
    expect(screen.getByRole("button")).toHaveClass(
      "px-5",
      "py-2.5",
      "rounded-xl",
    );
  });

  it("keeps collision-prone classes in the size table only, so size=lg carries no rounded-xl", () => {
    render(<Button size="lg">Big</Button>);
    expect(screen.getByRole("button")).not.toHaveClass("rounded-xl");
  });
});
