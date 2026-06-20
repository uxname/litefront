import { cleanup, render } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { Skeleton } from "./Skeleton";

afterEach(cleanup);

describe("Skeleton", () => {
  it("renders a div element", () => {
    const { container } = render(<Skeleton />);
    const el = container.firstChild as HTMLElement;
    expect(el).toBeInstanceOf(HTMLDivElement);
  });

  it("is hidden from the accessibility tree", () => {
    const { container } = render(<Skeleton />);
    const el = container.firstChild as HTMLElement;
    expect(el).toHaveAttribute("aria-hidden", "true");
  });

  it("always applies the pulsing placeholder classes", () => {
    const { container } = render(<Skeleton />);
    const el = container.firstChild as HTMLElement;
    expect(el).toHaveClass("animate-pulse");
    expect(el).toHaveClass("bg-base-300/70");
  });

  it("defaults to the line variant", () => {
    const { container } = render(<Skeleton />);
    const el = container.firstChild as HTMLElement;
    expect(el).toHaveClass("h-4", "w-full", "rounded");
  });

  it("applies the line variant classes", () => {
    const { container } = render(<Skeleton variant="line" />);
    const el = container.firstChild as HTMLElement;
    expect(el).toHaveClass("h-4", "w-full", "rounded");
  });

  it("applies the circle variant classes", () => {
    const { container } = render(<Skeleton variant="circle" />);
    const el = container.firstChild as HTMLElement;
    expect(el).toHaveClass("rounded-full");
    expect(el).not.toHaveClass("rounded-xl");
  });

  it("applies the rect variant classes", () => {
    const { container } = render(<Skeleton variant="rect" />);
    const el = container.firstChild as HTMLElement;
    expect(el).toHaveClass("w-full", "rounded-xl");
  });

  it("applies a numeric width as pixels in the inline style", () => {
    const { container } = render(<Skeleton width={120} />);
    const el = container.firstChild as HTMLElement;
    expect(el).toHaveStyle({ width: "120px" });
  });

  it("applies a string width verbatim in the inline style", () => {
    const { container } = render(<Skeleton width="50%" />);
    const el = container.firstChild as HTMLElement;
    expect(el).toHaveStyle({ width: "50%" });
  });

  it("applies a numeric height as pixels in the inline style", () => {
    const { container } = render(<Skeleton height={48} />);
    const el = container.firstChild as HTMLElement;
    expect(el).toHaveStyle({ height: "48px" });
  });

  it("applies a string height verbatim in the inline style", () => {
    const { container } = render(<Skeleton height="2rem" />);
    const el = container.firstChild as HTMLElement;
    expect(el).toHaveStyle({ height: "2rem" });
  });

  it("sets no width or height style when neither prop is provided", () => {
    const { container } = render(<Skeleton />);
    const el = container.firstChild as HTMLElement;
    expect(el.style.width).toBe("");
    expect(el.style.height).toBe("");
  });

  it("merges a custom className with the variant classes", () => {
    const { container } = render(<Skeleton className="custom-x" />);
    const el = container.firstChild as HTMLElement;
    expect(el).toHaveClass("custom-x");
    expect(el).toHaveClass("animate-pulse");
  });
});
