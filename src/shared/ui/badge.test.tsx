import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { Badge } from "./badge";

afterEach(cleanup);

describe("Badge", () => {
  it("renders its text with the chosen variant", () => {
    render(<Badge variant="secondary">Admin</Badge>);
    expect(screen.getByText("Admin")).toHaveAttribute(
      "data-variant",
      "secondary",
    );
  });

  it("can render as a link", () => {
    render(
      <Badge asChild>
        <a href="/docs">Docs</a>
      </Badge>,
    );
    expect(screen.getByRole("link", { name: "Docs" })).toHaveAttribute(
      "data-slot",
      "badge",
    );
  });
});
