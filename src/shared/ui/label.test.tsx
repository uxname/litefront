import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { Label } from "./label";

afterEach(cleanup);

describe("Label", () => {
  it("names the control it points at", () => {
    render(
      <>
        <Label htmlFor="email">Email</Label>
        <input id="email" />
      </>,
    );
    expect(screen.getByLabelText("Email")).toHaveAttribute("id", "email");
  });
});
