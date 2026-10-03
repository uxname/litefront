import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { useThemeStore } from "../model/store";
import { ThemeToggle } from "./ThemeToggle";

beforeEach(() => useThemeStore.setState({ theme: "system" }));
afterEach(cleanup);

describe("ThemeToggle", () => {
  it("offers the three choices with the current one checked", async () => {
    const user = userEvent.setup();
    render(<ThemeToggle />);
    await user.click(screen.getByRole("button", { name: "theme_toggle" }));

    expect(screen.getAllByRole("menuitemradio")).toHaveLength(3);
    expect(
      screen.getByRole("menuitemradio", { name: "theme_system" }),
    ).toBeChecked();
  });

  it("applies the picked theme", async () => {
    const user = userEvent.setup();
    render(<ThemeToggle />);
    await user.click(screen.getByRole("button", { name: "theme_toggle" }));
    await user.click(screen.getByRole("menuitemradio", { name: "theme_dark" }));

    expect(useThemeStore.getState().theme).toBe("dark");
    expect(document.documentElement.dataset.theme).toBe("dark");
  });
});
