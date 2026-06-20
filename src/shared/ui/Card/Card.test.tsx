import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { Card } from "./Card";

afterEach(cleanup);

describe("Card", () => {
  it("renders its children inside the body", () => {
    render(
      <Card>
        <span data-testid="body">Body content</span>
      </Card>,
    );
    expect(screen.getByTestId("body")).toBeInTheDocument();
  });

  it("renders as a section landmark element", () => {
    const { container } = render(<Card>content</Card>);
    expect(container.querySelector("section")).toBeInTheDocument();
  });

  it("renders the title as a level-2 heading when provided", () => {
    render(<Card title="My title">body</Card>);
    expect(
      screen.getByRole("heading", { level: 2, name: "My title" }),
    ).toBeInTheDocument();
  });

  it("does not render a heading when no title is given", () => {
    render(<Card>body</Card>);
    expect(screen.queryByRole("heading")).not.toBeInTheDocument();
  });

  it("renders the description text when provided", () => {
    render(
      <Card title="Title" description="Some description">
        body
      </Card>,
    );
    expect(screen.getByText("Some description")).toBeInTheDocument();
  });

  it("does not render the description when omitted", () => {
    render(<Card title="Title">body</Card>);
    expect(screen.queryByText("Some description")).not.toBeInTheDocument();
  });

  it("does not render the header when neither title nor actions are given", () => {
    const { container } = render(<Card>just body</Card>);
    expect(container.querySelector("header")).not.toBeInTheDocument();
  });

  it("renders the header when only a title is given", () => {
    const { container } = render(<Card title="Title">body</Card>);
    expect(container.querySelector("header")).toBeInTheDocument();
  });

  it("renders the header when only actions are given (no title)", () => {
    const { container } = render(
      <Card actions={<button type="button">Act</button>}>body</Card>,
    );
    expect(container.querySelector("header")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Act" })).toBeInTheDocument();
    expect(screen.queryByRole("heading")).not.toBeInTheDocument();
  });

  it("renders actions alongside the title", () => {
    render(
      <Card title="Title" actions={<button type="button">Edit</button>}>
        body
      </Card>,
    );
    expect(
      screen.getByRole("heading", { level: 2, name: "Title" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Edit" })).toBeInTheDocument();
  });

  it("accepts ReactNode (not just strings) for title and description", () => {
    render(
      <Card
        title={<span data-testid="node-title">Rich title</span>}
        description={<em data-testid="node-desc">Rich description</em>}
      >
        body
      </Card>,
    );
    expect(screen.getByTestId("node-title")).toBeInTheDocument();
    expect(screen.getByTestId("node-desc")).toBeInTheDocument();
  });

  it("merges a custom className onto the section element", () => {
    const { container } = render(<Card className="custom-card">body</Card>);
    expect(container.querySelector("section")).toHaveClass("custom-card");
    // base styles still applied alongside the custom class
    expect(container.querySelector("section")).toHaveClass("rounded-2xl");
  });

  it("applies the default body padding when no bodyClassName is given", () => {
    render(
      <Card>
        <span data-testid="body">x</span>
      </Card>,
    );
    const body = screen.getByTestId("body").parentElement;
    expect(body).toHaveClass("px-5", "py-5");
  });

  it("uses a custom bodyClassName in place of the default body padding", () => {
    render(
      <Card bodyClassName="custom-body">
        <span data-testid="body">x</span>
      </Card>,
    );
    const body = screen.getByTestId("body").parentElement;
    expect(body).toHaveClass("custom-body");
    expect(body).not.toHaveClass("px-5");
  });

  it("renders without crashing when given no props", () => {
    const { container } = render(<Card />);
    expect(container.querySelector("section")).toBeInTheDocument();
    expect(container.querySelector("header")).not.toBeInTheDocument();
  });
});
