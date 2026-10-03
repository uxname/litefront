import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./card";

afterEach(cleanup);

describe("Card", () => {
  it("renders every part in order", () => {
    render(
      <Card data-testid="card">
        <CardHeader>
          <CardTitle>Title</CardTitle>
          <CardDescription>Description</CardDescription>
          <CardAction>
            <button type="button">Act</button>
          </CardAction>
        </CardHeader>
        <CardContent>Body</CardContent>
        <CardFooter>Footer</CardFooter>
      </Card>,
    );
    expect(screen.getByTestId("card")).toHaveTextContent(
      "TitleDescriptionActBodyFooter",
    );
  });

  it("lets the caller add classes", () => {
    render(<Card data-testid="card" className="max-w-md" />);
    expect(screen.getByTestId("card")).toHaveClass("max-w-md");
  });
});
