import type { Meta, StoryFn } from "@storybook/react-vite";
import { useEffect } from "react";
import { Toaster, toast } from "./sonner";

export default { component: Toaster } satisfies Meta<typeof Toaster>;

// sonner keeps its own `theme` prop instead of reading data-theme; the app
// passes it in __root.tsx, so the story passes the toolbar's theme the same way.
type ToasterTheme = React.ComponentProps<typeof Toaster>["theme"];
const themeOf = (globals: Record<string, unknown>): ToasterTheme =>
  globals.theme === "dark" ? "dark" : "light";

const Fire = ({ show }: { show: () => void }) => {
  useEffect(() => {
    show();
  }, [show]);
  return null;
};

const story =
  (show: () => void): StoryFn =>
  (_, { globals }) => (
    <>
      <Toaster theme={themeOf(globals)} expand />
      <Fire show={show} />
    </>
  );

export const Default = story(() => toast("Saved your changes"));
export const Success = story(() =>
  toast.success("Profile saved", { description: "New value has been set." }),
);
export const ErrorToast = story(() => toast.error("Failed to save profile"));
export const Warning = story(() =>
  toast.warning("Your session is about to expire"),
);
export const Info = story(() => toast.info("A new version is available"));
