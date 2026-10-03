import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";
import { Textarea } from "./textarea";

afterEach(cleanup);

describe("Textarea", () => {
  it("accepts multi-line typing", async () => {
    const user = userEvent.setup();
    render(<Textarea aria-label="Bio" />);
    const field = screen.getByRole("textbox", { name: "Bio" });
    await user.type(field, "one{enter}two");
    expect(field).toHaveValue("one\ntwo");
  });

  it("reports an invalid state and a disabled one", () => {
    render(<Textarea aria-label="Bio" aria-invalid disabled />);
    const field = screen.getByRole("textbox", { name: "Bio" });
    expect(field).toBeInvalid();
    expect(field).toBeDisabled();
  });
});
