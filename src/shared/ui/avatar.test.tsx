import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

const renderAvatar = () =>
  render(
    <Avatar>
      <AvatarImage src="/me.png" alt="Ada" />
      <AvatarFallback>AL</AvatarFallback>
    </Avatar>,
  );

describe("Avatar", () => {
  it("shows the fallback while the image has not loaded", () => {
    // jsdom never loads images, which is exactly the not-loaded case.
    renderAvatar();
    expect(screen.getByText("AL")).toBeInTheDocument();
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });

  it("shows the image once it has loaded", () => {
    vi.stubGlobal(
      "Image",
      class {
        complete = true;
        naturalWidth = 1;
        addEventListener() {}
        removeEventListener() {}
      },
    );
    renderAvatar();
    expect(screen.getByRole("img", { name: "Ada" })).toHaveAttribute(
      "src",
      "/me.png",
    );
  });
});
