import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { Spinner } from "./spinner";

afterEach(cleanup);

describe("Spinner", () => {
  it("is a status with a localized label", () => {
    render(<Spinner />);
    expect(
      screen.getByRole("status", { name: "common_loading" }),
    ).toBeInTheDocument();
  });

  it("takes a more specific label", () => {
    render(<Spinner aria-label="Saving" />);
    expect(screen.getByRole("status", { name: "Saving" })).toBeInTheDocument();
  });
});
