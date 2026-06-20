import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Textarea } from "./Textarea";

afterEach(cleanup);

describe("Textarea", () => {
  it("renders a textbox", () => {
    render(<Textarea aria-label="Bio" />);
    expect(screen.getByRole("textbox", { name: "Bio" })).toBeInTheDocument();
  });

  it("renders the underlying textarea element", () => {
    render(<Textarea aria-label="Notes" />);
    expect(screen.getByRole("textbox")).toBeInstanceOf(HTMLTextAreaElement);
  });

  it("defaults to 4 rows", () => {
    render(<Textarea aria-label="Default rows" />);
    expect(screen.getByRole("textbox")).toHaveAttribute("rows", "4");
  });

  it("honours an explicit rows value", () => {
    render(<Textarea aria-label="Tall" rows={10} />);
    expect(screen.getByRole("textbox")).toHaveAttribute("rows", "10");
  });

  it("forwards a placeholder", () => {
    render(<Textarea placeholder="Type here" />);
    expect(screen.getByPlaceholderText("Type here")).toBeInTheDocument();
  });

  it("does not set aria-invalid by default", () => {
    render(<Textarea aria-label="Clean" />);
    expect(screen.getByRole("textbox")).not.toHaveAttribute("aria-invalid");
  });

  it("sets aria-invalid when invalid is true", () => {
    render(<Textarea aria-label="Bad" invalid />);
    expect(screen.getByRole("textbox")).toHaveAttribute("aria-invalid", "true");
  });

  it("accepts typed input", async () => {
    const user = userEvent.setup();
    render(<Textarea aria-label="Editable" />);
    const textarea = screen.getByRole("textbox");
    await user.type(textarea, "hello world");
    expect(textarea).toHaveValue("hello world");
  });

  it("calls onChange as the user types", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Textarea aria-label="Tracked" onChange={onChange} />);
    await user.type(screen.getByRole("textbox"), "abc");
    expect(onChange).toHaveBeenCalledTimes(3);
  });

  it("is disabled and does not accept input when disabled", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Textarea aria-label="Locked" disabled onChange={onChange} />);
    const textarea = screen.getByRole("textbox");
    expect(textarea).toBeDisabled();
    await user.type(textarea, "nope");
    expect(textarea).toHaveValue("");
    expect(onChange).not.toHaveBeenCalled();
  });

  it("respects a controlled value", () => {
    render(<Textarea aria-label="Controlled" value="fixed" readOnly />);
    expect(screen.getByRole("textbox")).toHaveValue("fixed");
  });

  it("renders a default (uncontrolled) value", () => {
    render(<Textarea aria-label="Uncontrolled" defaultValue="seed" />);
    expect(screen.getByRole("textbox")).toHaveValue("seed");
  });

  it("merges a custom className with the base classes", () => {
    render(<Textarea aria-label="Styled" className="custom-x" />);
    expect(screen.getByRole("textbox")).toHaveClass("custom-x");
  });

  it("forwards a ref to the underlying textarea element", () => {
    const ref = createRef<HTMLTextAreaElement>();
    render(<Textarea aria-label="Ref" ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLTextAreaElement);
  });

  it("forwards arbitrary textarea attributes", () => {
    render(<Textarea aria-label="Limited" maxLength={120} name="comment" />);
    const textarea = screen.getByRole("textbox");
    expect(textarea).toHaveAttribute("maxLength", "120");
    expect(textarea).toHaveAttribute("name", "comment");
  });
});
