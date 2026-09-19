import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Button, buttonClasses } from "./Button";

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

  // Size, fill and radius come from daisyUI's `btn` classes, not from utilities
  // of ours: a call site's own utility then always wins (a utility outranks a
  // daisyUI component class), which is what makes className a real override.
  it("every button is a daisyUI btn", () => {
    render(<Button>Any</Button>);
    expect(screen.getByRole("button")).toHaveClass("btn");
  });

  it.each([
    ["sm", "btn-sm"],
    ["lg", "btn-lg"],
  ] as const)("size=%s is daisyUI's %s", (size, cls) => {
    render(<Button size={size}>Sized</Button>);
    expect(screen.getByRole("button")).toHaveClass(cls);
  });

  it("size=md is the plain btn — no size modifier at all", () => {
    render(<Button size="md">Medium</Button>);
    const btn = screen.getByRole("button");
    expect(btn).not.toHaveClass("btn-sm");
    expect(btn).not.toHaveClass("btn-lg");
  });

  it("carries no padding or radius utilities of its own", () => {
    for (const size of ["sm", "md", "lg"] as const) {
      expect(buttonClasses({ size })).not.toMatch(/\b(px|py|rounded)-/);
    }
  });

  it("exposes the same class string to non-button call sites", () => {
    const classes = buttonClasses({ size: "lg" });
    expect(classes).toContain("btn");
    expect(classes).toContain("btn-lg");
  });

  it("builds its own classes with buttonClasses (one implementation, two callers)", () => {
    render(<Button size="lg">Big</Button>);
    expect(screen.getByRole("button").className).toBe(
      buttonClasses({ size: "lg" }),
    );
  });
  it("primary is daisyUI's filled accent button", () => {
    render(<Button>Go</Button>);
    expect(screen.getByRole("button")).toHaveClass("btn-primary");
  });

  it("danger-solid is a filled red button", () => {
    render(<Button variant="danger-solid">Crash</Button>);
    const btn = screen.getByRole("button");
    expect(btn).toHaveClass("btn-error");
    expect(btn).not.toHaveClass("btn-outline");
  });

  it("danger is its quiet sibling: outlined, not filled", () => {
    render(<Button variant="danger">Delete</Button>);
    expect(screen.getByRole("button")).toHaveClass("btn-outline", "btn-error");
  });

  it("ghost is a bordered button on the page surface, with no accent fill", () => {
    render(<Button variant="ghost">Back</Button>);
    const btn = screen.getByRole("button");
    expect(btn).toHaveClass("bg-base-100", "border-base-300");
    expect(btn).not.toHaveClass("btn-primary");
    expect(btn).not.toHaveClass("btn-error");
  });

  // daisyUI draws the ring (2px, offset 2px) but leaves its colour to the
  // variant, so every variant names exactly one: the accent, or red for a
  // destructive action (DESIGN.md, "Focus must always be visible").
  it.each([
    ["primary", "focus-visible:outline-primary"],
    ["ghost", "focus-visible:outline-primary"],
    ["danger", "focus-visible:outline-error"],
    ["danger-solid", "focus-visible:outline-error"],
  ] as const)("variant=%s has exactly one ring colour: %s", (variant, ring) => {
    const rings = buttonClasses({ variant })
      .split(" ")
      .filter((c) => /^focus-visible:outline-(primary|error)$/.test(c));
    expect(rings).toEqual([ring]);
  });

  it("pins no shadow utility, so the page decides how far a button lifts", () => {
    // Two shadow utilities on one element are resolved by stylesheet order, not
    // by the order written — a built-in shadow-sm could beat className="shadow-lg".
    for (const variant of [
      "primary",
      "ghost",
      "danger",
      "danger-solid",
    ] as const) {
      expect(buttonClasses({ variant })).not.toContain("shadow");
    }
  });
});
