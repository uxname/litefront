import { act, cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { Toaster, toast } from "./sonner";

afterEach(() => {
  toast.dismiss();
  cleanup();
});

describe("Toaster", () => {
  it("renders a toast fired through the re-exported toast()", async () => {
    render(<Toaster />);
    act(() => {
      toast.success("Profile saved", { description: "All good" });
    });
    expect(await screen.findByText("Profile saved")).toBeInTheDocument();
    expect(screen.getByText("All good")).toBeInTheDocument();
  });

  it("takes the theme from its prop, since it does not read data-theme", async () => {
    const { container } = render(<Toaster theme="dark" />);
    act(() => {
      toast("Hi");
    });
    await screen.findByText("Hi");
    expect(
      container.ownerDocument.querySelector("[data-sonner-toaster]"),
    ).toHaveAttribute("data-sonner-theme", "dark");
  });
});
