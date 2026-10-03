import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { PageLoader } from "./page-loader";

afterEach(cleanup);

describe("PageLoader", () => {
  it("announces a generic loading status by default", () => {
    render(<PageLoader />);
    expect(
      screen.getByRole("status", { name: "common_loading" }),
    ).toBeInTheDocument();
  });

  it("shows and announces a specific label", () => {
    render(<PageLoader label="Verifying" />);
    expect(
      screen.getByRole("status", { name: "Verifying" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Verifying")).toBeInTheDocument();
  });
});
