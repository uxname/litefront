import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { Field, FieldDescription, FieldError, FieldLabel } from "./field";

afterEach(cleanup);

describe("Field", () => {
  it("labels its control and shows the description", () => {
    render(
      <Field>
        <FieldLabel htmlFor="name">Name</FieldLabel>
        <input id="name" />
        <FieldDescription>Public</FieldDescription>
      </Field>,
    );
    expect(screen.getByLabelText("Name")).toBeInTheDocument();
    expect(screen.getByText("Public")).toBeInTheDocument();
  });

  it("announces an error as an alert", () => {
    render(<FieldError id="name-error">Required</FieldError>);
    expect(screen.getByRole("alert")).toHaveTextContent("Required");
    expect(screen.getByRole("alert")).toHaveAttribute("id", "name-error");
  });

  it("renders nothing when there is no error", () => {
    const { container } = render(<FieldError>{undefined}</FieldError>);
    expect(container).toBeEmptyDOMElement();
  });

  it("lists several distinct errors, once each", () => {
    render(
      <FieldError
        errors={[
          { message: "Too short" },
          { message: "Too short" },
          { message: "No digits" },
        ]}
      />,
    );
    expect(screen.getAllByRole("listitem")).toHaveLength(2);
  });
});
