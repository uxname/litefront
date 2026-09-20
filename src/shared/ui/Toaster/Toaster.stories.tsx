import type { Meta, StoryFn } from "@storybook/react-vite";
import { Toaster, toast } from "./Toaster";

export default { component: Toaster } satisfies Meta<typeof Toaster>;

// sonner does not read daisyUI's data-theme: it keeps its own `theme` prop and
// hard-codes a few colours per theme. The app passes it in __root.tsx, so the
// stories pass it too — from the toolbar's theme. Without this the toolbar
// would restyle everything around the toast and leave the toast itself light.
type ToasterTheme = React.ComponentProps<typeof Toaster>["theme"];
const themeOf = (globals: Record<string, unknown>): ToasterTheme =>
  globals.theme === "dark" ? "dark" : "light";

const TriggerRow = () => (
  <div className="flex flex-wrap gap-3">
    <button
      type="button"
      onClick={() => toast("Saved your changes")}
      className="rounded-xl border border-base-300 px-4 py-2 text-sm font-semibold"
    >
      Default
    </button>
    <button
      type="button"
      onClick={() => toast.success("Profile updated")}
      className="rounded-xl border border-base-300 px-4 py-2 text-sm font-semibold"
    >
      Success
    </button>
    <button
      type="button"
      onClick={() => toast.error("Something went wrong")}
      className="rounded-xl border border-base-300 px-4 py-2 text-sm font-semibold"
    >
      Error
    </button>
    <button
      type="button"
      onClick={() => toast.warning("Your session is about to expire")}
      className="rounded-xl border border-base-300 px-4 py-2 text-sm font-semibold"
    >
      Warning
    </button>
    <button
      type="button"
      onClick={() => toast.info("A new version is available")}
      className="rounded-xl border border-base-300 px-4 py-2 text-sm font-semibold"
    >
      Info
    </button>
  </div>
);

export const Default: StoryFn = (_args, { globals }) => (
  <>
    <button
      type="button"
      onClick={() => toast("Saved your changes")}
      className="rounded-xl border border-base-300 px-4 py-2 text-sm font-semibold"
    >
      Show toast
    </button>
    <Toaster theme={themeOf(globals)} />
  </>
);

export const AllTypes: StoryFn = (_args, { globals }) => (
  <>
    <TriggerRow />
    <Toaster theme={themeOf(globals)} />
  </>
);

export const WithDescription: StoryFn = (_args, { globals }) => (
  <>
    <button
      type="button"
      onClick={() =>
        toast.success("Profile updated", {
          description: "Your changes have been saved to your account.",
        })
      }
      className="rounded-xl border border-base-300 px-4 py-2 text-sm font-semibold"
    >
      Show toast with description
    </button>
    <Toaster theme={themeOf(globals)} />
  </>
);

export const WithAction: StoryFn = (_args, { globals }) => (
  <>
    <button
      type="button"
      onClick={() =>
        toast("Item deleted", {
          action: {
            label: "Undo",
            onClick: () => toast.success("Restored"),
          },
        })
      }
      className="rounded-xl border border-base-300 px-4 py-2 text-sm font-semibold"
    >
      Show toast with action
    </button>
    <Toaster theme={themeOf(globals)} />
  </>
);

export const TopCenterPosition: StoryFn = (_args, { globals }) => (
  <>
    <button
      type="button"
      onClick={() => toast("Pinned to the top")}
      className="rounded-xl border border-base-300 px-4 py-2 text-sm font-semibold"
    >
      Show top-center toast
    </button>
    <Toaster position="top-center" theme={themeOf(globals)} />
  </>
);

export const WithCloseButton: StoryFn = (_args, { globals }) => (
  <>
    <button
      type="button"
      onClick={() => toast("Dismiss me with the close button")}
      className="rounded-xl border border-base-300 px-4 py-2 text-sm font-semibold"
    >
      Show closable toast
    </button>
    <Toaster closeButton theme={themeOf(globals)} />
  </>
);
