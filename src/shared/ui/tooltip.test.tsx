import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./tooltip";

afterEach(cleanup);

describe("Tooltip", () => {
  it("shows its text when the trigger gets keyboard focus", async () => {
    const user = userEvent.setup();
    render(
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>Copy</TooltipTrigger>
          <TooltipContent>Copy stack trace</TooltipContent>
        </Tooltip>
      </TooltipProvider>,
    );
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();

    await user.tab();
    expect(await screen.findByRole("tooltip")).toHaveTextContent(
      "Copy stack trace",
    );
  });
});
