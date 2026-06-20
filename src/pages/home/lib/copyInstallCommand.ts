import { m } from "@generated/paraglide/messages";
import { toast } from "@shared/ui/Toaster";

/**
 * The scaffolding command shown in the hero section and copied to the
 * clipboard. Kept as a single source of truth so the rendered text and the
 * copied text can never drift apart.
 */
export const INSTALL_COMMAND = "npx degit uxname/litefront my-app";

/**
 * Copies the install command to the clipboard and shows a success toast.
 * Extracted from the page so the behaviour can be unit-tested in isolation.
 */
export const copyInstallCommand = (): void => {
  navigator.clipboard.writeText(INSTALL_COMMAND);
  toast.success(m.home_copy_command_success());
};
