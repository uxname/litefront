import { cleanup, render } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { Skeleton } from "./skeleton";

afterEach(cleanup);

describe("Skeleton", () => {
  it("takes its shape from the caller", () => {
    const { container } = render(<Skeleton className="size-16 rounded-full" />);
    expect(container.firstChild).toHaveClass("size-16", "rounded-full");
    expect(container.firstChild).toHaveAttribute("data-slot", "skeleton");
  });
});
