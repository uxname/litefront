import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ProfileForm } from "./ProfileForm";

// The component reads `useUpdateProfileMutation` from the generated GraphQL
// module; mock it so the test runs without a urql provider. The hook returns
// the urql tuple [result, executeMutation].
vi.mock("@generated/graphql", () => ({
  useUpdateProfileMutation: () => [{}, vi.fn()],
}));

// Avatar upload talks to a REST endpoint; stub it so nothing hits the network.
vi.mock("../api/upload-avatar", () => ({
  uploadAvatar: vi.fn(),
}));

afterEach(cleanup);

const sampleProfile = {
  avatarUrl: "https://example.com/avatar.png",
  displayName: "Ada Lovelace",
  bio: "Mathematician and writer.",
};

describe("ProfileForm", () => {
  it("renders the form with its fields and save button", () => {
    render(<ProfileForm profile={sampleProfile} />);

    // displayName + bio inputs and the submit button are present.
    expect(screen.getByLabelText("profile_display_name")).toBeInTheDocument();
    expect(screen.getByLabelText("profile_bio")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "profile_save" }),
    ).toBeInTheDocument();
  });

  it("populates the inputs from the supplied profile", () => {
    render(<ProfileForm profile={sampleProfile} />);

    expect(screen.getByLabelText("profile_display_name")).toHaveValue(
      "Ada Lovelace",
    );
    expect(screen.getByLabelText("profile_bio")).toHaveValue(
      "Mathematician and writer.",
    );
  });

  it("renders the avatar image when the profile has an avatarUrl", () => {
    render(<ProfileForm profile={sampleProfile} />);

    const img = screen.getByRole("img", { name: "profile_avatar" });
    expect(img).toHaveAttribute("src", "https://example.com/avatar.png");
  });

  it("falls back to the placeholder icon when there is no avatarUrl", () => {
    render(<ProfileForm profile={{ ...sampleProfile, avatarUrl: null }} />);

    expect(
      screen.queryByRole("img", { name: "profile_avatar" }),
    ).not.toBeInTheDocument();
  });

  it("disables the save button when the form is pristine", () => {
    render(<ProfileForm profile={sampleProfile} />);

    expect(screen.getByRole("button", { name: "profile_save" })).toBeDisabled();
  });

  it("renders empty inputs when profile fields are null", () => {
    render(
      <ProfileForm
        profile={{ avatarUrl: null, displayName: null, bio: null }}
      />,
    );

    expect(screen.getByLabelText("profile_display_name")).toHaveValue("");
    expect(screen.getByLabelText("profile_bio")).toHaveValue("");
  });
});
