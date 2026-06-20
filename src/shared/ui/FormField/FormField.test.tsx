import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { FormField } from "./FormField";

afterEach(cleanup);

describe("FormField", () => {
  it("renders the label text", () => {
    render(
      <FormField htmlFor="email" label="Email address">
        <input id="email" />
      </FormField>,
    );
    expect(screen.getByText("Email address")).toBeInTheDocument();
  });

  it("renders its children (the control)", () => {
    render(
      <FormField htmlFor="email" label="Email">
        <input id="email" data-testid="control" />
      </FormField>,
    );
    expect(screen.getByTestId("control")).toBeInTheDocument();
  });

  it("associates the label with the control via htmlFor/id", () => {
    render(
      <FormField htmlFor="email" label="Email">
        <input id="email" />
      </FormField>,
    );
    // getByLabelText resolves the label -> control association.
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
  });

  it("sets the label's for attribute to htmlFor", () => {
    render(
      <FormField htmlFor="my-control" label="Field">
        <input id="my-control" />
      </FormField>,
    );
    const label = screen.getByText("Field");
    expect(label).toHaveAttribute("for", "my-control");
  });

  it("does not render a required marker by default", () => {
    render(
      <FormField htmlFor="email" label="Email">
        <input id="email" />
      </FormField>,
    );
    expect(screen.queryByText("*")).not.toBeInTheDocument();
  });

  it("renders a required marker when required is set", () => {
    render(
      <FormField htmlFor="email" label="Email" required>
        <input id="email" />
      </FormField>,
    );
    expect(screen.getByText("*")).toBeInTheDocument();
  });

  it("renders a hint when provided and no error", () => {
    render(
      <FormField htmlFor="email" label="Email" hint="We never share it">
        <input id="email" />
      </FormField>,
    );
    expect(screen.getByText("We never share it")).toBeInTheDocument();
  });

  it("does not render a hint when none is provided", () => {
    render(
      <FormField htmlFor="email" label="Email">
        <input id="email" />
      </FormField>,
    );
    expect(screen.queryByText("We never share it")).not.toBeInTheDocument();
  });

  it("renders an error message when provided", () => {
    render(
      <FormField htmlFor="email" label="Email" error="Required field">
        <input id="email" />
      </FormField>,
    );
    expect(screen.getByText("Required field")).toBeInTheDocument();
  });

  it("gives the error element an id of '<htmlFor>-error' for aria-describedby wiring", () => {
    render(
      <FormField htmlFor="email" label="Email" error="Required field">
        <input id="email" />
      </FormField>,
    );
    const errorEl = screen.getByText("Required field");
    expect(errorEl).toHaveAttribute("id", "email-error");
  });

  it("shows the error instead of the hint when both are provided", () => {
    render(
      <FormField
        htmlFor="email"
        label="Email"
        hint="We never share it"
        error="Required field"
      >
        <input id="email" />
      </FormField>,
    );
    expect(screen.getByText("Required field")).toBeInTheDocument();
    expect(screen.queryByText("We never share it")).not.toBeInTheDocument();
  });

  it("applies a custom className to the wrapper", () => {
    const { container } = render(
      <FormField htmlFor="email" label="Email" className="custom-x">
        <input id="email" />
      </FormField>,
    );
    expect(container.firstChild).toHaveClass("custom-x");
  });

  it("keeps the base layout classes alongside a custom className", () => {
    const { container } = render(
      <FormField htmlFor="email" label="Email" className="custom-x">
        <input id="email" />
      </FormField>,
    );
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass("flex", "flex-col", "custom-x");
  });
});
