import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { Alert, AlertDescription, AlertTitle } from "./alert";

afterEach(cleanup);

describe("Alert", () => {
  it("is announced as an alert with its title and description", () => {
    render(
      <Alert variant="destructive">
        <AlertTitle>Failed</AlertTitle>
        <AlertDescription>Try again</AlertDescription>
      </Alert>,
    );
    expect(screen.getByRole("alert")).toHaveTextContent("FailedTry again");
  });
});
