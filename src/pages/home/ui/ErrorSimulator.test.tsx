import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ErrorBoundary } from "react-error-boundary";
import { afterEach, describe, expect, it } from "vitest";
import { ErrorSimulator } from "./ErrorSimulator";

afterEach(cleanup);

// The global paraglide mock makes each message key echo its own name, so the
// crash button's label renders as the literal "home_crash_app".
describe("ErrorSimulator", () => {
  it("renders the crash button and hint", () => {
    render(
      <ErrorBoundary fallbackRender={() => null}>
        <ErrorSimulator />
      </ErrorBoundary>,
    );
    expect(
      screen.getByRole("button", { name: /home_crash_app/ }),
    ).toBeInTheDocument();
    expect(screen.getByText("home_error_sim_hint")).toBeInTheDocument();
  });

  it("propagates a simulated error to the surrounding ErrorBoundary on click", async () => {
    const user = userEvent.setup();
    render(
      <ErrorBoundary
        fallbackRender={({ error }) => (
          <div role="alert">
            {error instanceof Error ? error.message : String(error)}
          </div>
        )}
      >
        <ErrorSimulator />
      </ErrorBoundary>,
    );

    await user.click(screen.getByRole("button", { name: /home_crash_app/ }));

    expect(screen.getByRole("alert")).toHaveTextContent(
      "Simulated Critical Failure: This is a test of the Error Boundary system.",
    );
  });
});
