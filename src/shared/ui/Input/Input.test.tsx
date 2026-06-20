import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Input } from "./Input";

afterEach(cleanup);

describe("Input", () => {
  it("renders a textbox", () => {
    render(<Input />);
    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });

  it("renders an HTML input element", () => {
    render(<Input />);
    expect(screen.getByRole("textbox")).toBeInstanceOf(HTMLInputElement);
  });

  it("forwards the placeholder attribute", () => {
    render(<Input placeholder="Email address" />);
    expect(screen.getByPlaceholderText("Email address")).toBeInTheDocument();
  });

  it("forwards arbitrary native input attributes", () => {
    render(<Input name="email" type="email" maxLength={40} />);
    const input = screen.getByRole("textbox");
    expect(input).toHaveAttribute("name", "email");
    expect(input).toHaveAttribute("type", "email");
    expect(input).toHaveAttribute("maxlength", "40");
  });

  it("does not set aria-invalid by default", () => {
    render(<Input />);
    expect(screen.getByRole("textbox")).not.toHaveAttribute("aria-invalid");
  });

  it("sets aria-invalid when invalid is true", () => {
    render(<Input invalid />);
    expect(screen.getByRole("textbox")).toHaveAttribute("aria-invalid", "true");
  });

  it("omits aria-invalid when invalid is explicitly false", () => {
    render(<Input invalid={false} />);
    expect(screen.getByRole("textbox")).not.toHaveAttribute("aria-invalid");
  });

  it("applies the error border class when invalid", () => {
    render(<Input invalid />);
    expect(screen.getByRole("textbox")).toHaveClass("border-error");
  });

  it("applies the default border class when valid", () => {
    render(<Input />);
    expect(screen.getByRole("textbox")).toHaveClass("border-base-300");
  });

  it("accepts typed input from the user", async () => {
    const user = userEvent.setup();
    render(<Input />);
    const input = screen.getByRole("textbox");
    await user.type(input, "hello");
    expect(input).toHaveValue("hello");
  });

  it("fires onChange as the user types", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Input onChange={onChange} />);
    await user.type(screen.getByRole("textbox"), "ab");
    expect(onChange).toHaveBeenCalledTimes(2);
  });

  it("is disabled and does not accept input when disabled", async () => {
    const user = userEvent.setup();
    render(<Input disabled />);
    const input = screen.getByRole("textbox");
    expect(input).toBeDisabled();
    await user.type(input, "nope");
    expect(input).toHaveValue("");
  });

  it("merges a custom className with the base classes", () => {
    render(<Input className="custom-x" />);
    const input = screen.getByRole("textbox");
    expect(input).toHaveClass("custom-x");
    expect(input).toHaveClass("w-full");
  });

  it("forwards a ref to the underlying input element", () => {
    const ref = createRef<HTMLInputElement>();
    render(<Input ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  it("respects a controlled value", () => {
    render(<Input value="fixed" readOnly />);
    expect(screen.getByRole("textbox")).toHaveValue("fixed");
  });
});
