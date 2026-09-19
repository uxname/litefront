import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { copyInstallCommand, INSTALL_COMMAND } from "./copyInstallCommand";

// Spy on the sonner toast so we can assert the notifications without rendering
// a real Toaster. The global paraglide mock makes every message key echo its
// own name, so `m.home_copy_command_success()` returns the literal
// "home_copy_command_success".
const successMock = vi.fn();
const errorMock = vi.fn();
vi.mock("sonner", () => ({
  toast: {
    success: (...args: unknown[]) => successMock(...args),
    error: (...args: unknown[]) => errorMock(...args),
  },
}));

const logErrorMock = vi.fn();
vi.mock("@shared/lib/logger", () => ({
  logError: (...args: unknown[]) => logErrorMock(...args),
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

  it("writes the install command to the clipboard", async () => {
    await copyInstallCommand();
    expect(navigator.clipboard.writeText).toHaveBeenCalledTimes(1);
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(INSTALL_COMMAND);
  });

  it("shows a success toast with the translated message", async () => {
    await copyInstallCommand();
    expect(successMock).toHaveBeenCalledTimes(1);
    expect(successMock).toHaveBeenCalledWith("home_copy_command_success");
    expect(errorMock).not.toHaveBeenCalled();
  });

  it("does not claim success before the clipboard write has finished", async () => {
    let finishWrite: () => void = () => {};
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn(
          () =>
            new Promise<void>((resolve) => {
              finishWrite = resolve;
            }),
        ),
      },
    });

    const pending = copyInstallCommand();
    expect(successMock).not.toHaveBeenCalled();
    finishWrite();
    await pending;
    expect(successMock).toHaveBeenCalledTimes(1);
  });

  it("reports a refused clipboard instead of claiming success", async () => {
    const denied = new DOMException(
      "Write permission denied",
      "NotAllowedError",
    );
    Object.assign(navigator, {
      clipboard: { writeText: vi.fn().mockRejectedValue(denied) },
    });

    await expect(copyInstallCommand()).resolves.toBeUndefined();

    expect(successMock).not.toHaveBeenCalled();
    expect(errorMock).toHaveBeenCalledWith("error_unexpected");
    expect(logErrorMock).toHaveBeenCalledWith("clipboard_write_failed", denied);
  });

  it("reports a missing clipboard API (insecure context) the same way", async () => {
    Object.assign(navigator, { clipboard: undefined });

    await expect(copyInstallCommand()).resolves.toBeUndefined();

    expect(successMock).not.toHaveBeenCalled();
    expect(errorMock).toHaveBeenCalledWith("error_unexpected");
    expect(logErrorMock).toHaveBeenCalledTimes(1);
  });
});
