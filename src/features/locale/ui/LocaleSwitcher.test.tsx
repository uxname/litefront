import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { LocaleSwitcher } from "./LocaleSwitcher";

const { setLocale } = vi.hoisted(() => ({ setLocale: vi.fn() }));
vi.mock("@generated/paraglide/runtime", () => ({
  getLocale: () => "en",
  locales: ["en", "ru"],
  setLocale,
}));

afterEach(cleanup);

describe("LocaleSwitcher", () => {
  it("lists every locale by its own name and marks the current one", async () => {
    const user = userEvent.setup();
    render(<LocaleSwitcher />);
    await user.click(screen.getByRole("button", { name: "locale_label" }));

    expect(
      screen.getByRole("menuitemradio", { name: /English/ }),
    ).toBeChecked();
    expect(
      screen.getByRole("menuitemradio", { name: /Русский/ }),
    ).not.toBeChecked();
  });

  it("switches to a different locale, and ignores the current one", async () => {
    const user = userEvent.setup();
    render(<LocaleSwitcher />);
    await user.click(screen.getByRole("button", { name: "locale_label" }));
    await user.click(screen.getByRole("menuitemradio", { name: /English/ }));
    expect(setLocale).not.toHaveBeenCalled();

    await user.click(screen.getByRole("button", { name: "locale_label" }));
    await user.click(screen.getByRole("menuitemradio", { name: /Русский/ }));
    expect(setLocale).toHaveBeenCalledWith("ru");
  });
});
