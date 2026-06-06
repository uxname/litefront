import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

// paraglide messages → return the key name for any message.
vi.mock("@generated/paraglide/messages", () => ({
  m: new Proxy({}, { get: (_t, key: string) => () => key }),
}));

const executeMutation = vi.fn(
  async (): Promise<{ error?: Error; data?: unknown }> => ({
    error: undefined,
    data: {},
  }),
);
vi.mock("@generated/graphql", () => ({
  useUpdateProfileMutation: () => [{ fetching: false }, executeMutation],
}));

const toastSuccess = vi.fn();
const toastError = vi.fn();
vi.mock("@shared/ui/Toaster", () => ({
  toast: { success: toastSuccess, error: toastError },
}));

const { ProfileForm } = await import("@features/profile/ui/ProfileForm");

describe("ProfileForm", () => {
  beforeEach(() => {
    executeMutation.mockClear();
    toastSuccess.mockClear();
    toastError.mockClear();
  });

  const emptyProfile = { avatarUrl: null, displayName: null, bio: null };

  it("disables save until the form is dirty", () => {
    render(<ProfileForm profile={emptyProfile} />);
    expect(screen.getByRole("button", { name: "profile_save" })).toBeDisabled();
  });

  it("submits only changed fields via updateProfile", async () => {
    const user = userEvent.setup();
    render(<ProfileForm profile={emptyProfile} />);

    await user.type(screen.getByLabelText("profile_display_name"), "Ann");
    await user.click(screen.getByRole("button", { name: "profile_save" }));

    await waitFor(() => expect(executeMutation).toHaveBeenCalledTimes(1));
    expect(executeMutation).toHaveBeenCalledWith({
      input: { displayName: "Ann" },
    });
    expect(toastSuccess).toHaveBeenCalled();
  });

  it("shows an error toast when the mutation fails", async () => {
    executeMutation.mockResolvedValueOnce({ error: new Error("boom") });
    const user = userEvent.setup();
    render(<ProfileForm profile={emptyProfile} />);

    await user.type(screen.getByLabelText("profile_display_name"), "Bob");
    await user.click(screen.getByRole("button", { name: "profile_save" }));

    await waitFor(() => expect(toastError).toHaveBeenCalled());
  });
});
