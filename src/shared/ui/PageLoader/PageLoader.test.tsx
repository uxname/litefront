import { cleanup, render } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { PageLoader } from "./PageLoader";

afterEach(cleanup);

describe("PageLoader", () => {
  it("renders without crashing", () => {
    const { container } = render(<PageLoader />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it("fills the viewport and centres its content", () => {
    const { container } = render(<PageLoader />);
    const root = container.firstElementChild;
    expect(root).toHaveClass(
      "flex",
      "min-h-screen",
      "w-full",
      "items-center",
      "justify-center",
      "bg-base-200",
    );
  });

  it("renders a single spinning indicator icon", () => {
    const { container } = render(<PageLoader />);
    const icon = container.querySelector("svg");
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveClass("animate-spin");
  });

  it("renders exactly one root element", () => {
    const { container } = render(<PageLoader />);
    expect(container.childElementCount).toBe(1);
  });
});
