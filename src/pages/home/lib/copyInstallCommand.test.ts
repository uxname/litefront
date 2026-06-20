import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { copyInstallCommand, INSTALL_COMMAND } from "./copyInstallCommand";

// Spy on the sonner toast so we can assert the success notification without
// rendering a real Toaster. The global paraglide mock makes every message key
// echo its own name, so `m.home_copy_command_success()` returns the literal
// "home_copy_command_success".
const successMock = vi.fn();
vi.mock("sonner", () => ({
  toast: { success: (...args: unknown[]) => successMock(...args) },
}));

describe("copyInstallCommand", () => {
  beforeEach(() => {
    Object.assign(navigator, {
      clipboard: { writeText: vi.fn().mockResolvedValue(undefined) },
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("exposes the exact scaffolding command", () => {
    expect(INSTALL_COMMAND).toBe("npx degit uxname/litefront my-app");
  });

  it("writes the install command to the clipboard", () => {
    copyInstallCommand();
    expect(navigator.clipboard.writeText).toHaveBeenCalledTimes(1);
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(INSTALL_COMMAND);
  });

  it("shows a success toast with the translated message", () => {
    copyInstallCommand();
    expect(successMock).toHaveBeenCalledTimes(1);
    expect(successMock).toHaveBeenCalledWith("home_copy_command_success");
  });
});
