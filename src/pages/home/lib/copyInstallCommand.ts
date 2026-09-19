import { m } from "@generated/paraglide/messages";
import { logError } from "@shared/lib/logger";
import { toast } from "@shared/ui/Toaster";

/**
 * The scaffolding command shown in the hero section and copied to the
 * clipboard. Kept as a single source of truth so the rendered text and the
 * copied text can never drift apart.
 */
export const INSTALL_COMMAND = "npx degit uxname/litefront my-app";

/**
 * Copies the install command to the clipboard and says how it went.
 * Extracted from the page so the behaviour can be unit-tested in isolation.
 *
 * The write is awaited: it is refused without clipboard permission, and
 * `navigator.clipboard` does not exist at all outside a secure context. Both used
 * to end in a "copied" toast over an unhandled rejection.
 */
export const copyInstallCommand = async (): Promise<void> => {
  try {
    await navigator.clipboard.writeText(INSTALL_COMMAND);
    toast.success(m.home_copy_command_success());
  } catch (error) {
    logError("clipboard_write_failed", error);
    toast.error(m.error_unexpected());
  }
};
