import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef } from "react";
import { afterEach, describe, expect, it } from "vitest";
import { Input } from "./input";

afterEach(cleanup);

describe("Input", () => {
  it("accepts typing", async () => {
    const user = userEvent.setup();
    render(<Input aria-label="Name" />);
    const input = screen.getByRole("textbox", { name: "Name" });
    await user.type(input, "Ada");
    expect(input).toHaveValue("Ada");
  });

  it("reports an invalid state to assistive tech", () => {
    render(<Input aria-label="Email" aria-invalid />);
    expect(screen.getByRole("textbox", { name: "Email" })).toBeInvalid();
  });

  it("forwards its ref and passes native attributes through", () => {
    const ref = createRef<HTMLInputElement>();
    render(<Input ref={ref} aria-label="Pass" type="password" disabled />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
    expect(ref.current).toHaveAttribute("type", "password");
    expect(ref.current).toBeDisabled();
  });
});
