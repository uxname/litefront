import type { Meta, StoryFn } from "@storybook/react-vite";
import { Toaster, toast } from "./Toaster";

export default { component: Toaster } satisfies Meta<typeof Toaster>;

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

export const Default: StoryFn = () => (
  <>
    <button
      type="button"
      onClick={() => toast("Saved your changes")}
      className="rounded-xl border border-base-300 px-4 py-2 text-sm font-semibold"
    >
      Show toast
    </button>
    <Toaster />
  </>
);

export const AllTypes: StoryFn = () => (
  <>
    <TriggerRow />
    <Toaster />
  </>
);

export const WithDescription: StoryFn = () => (
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
    <Toaster />
  </>
);

export const WithAction: StoryFn = () => (
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
    <Toaster />
  </>
);

export const TopCenterPosition: StoryFn = () => (
  <>
    <button
      type="button"
      onClick={() => toast("Pinned to the top")}
      className="rounded-xl border border-base-300 px-4 py-2 text-sm font-semibold"
    >
      Show top-center toast
    </button>
    <Toaster position="top-center" />
  </>
);

export const RichColors: StoryFn = () => (
  <>
    <TriggerRow />
    <Toaster richColors />
  </>
);

export const WithCloseButton: StoryFn = () => (
  <>
    <button
      type="button"
      onClick={() => toast("Dismiss me with the close button")}
      className="rounded-xl border border-base-300 px-4 py-2 text-sm font-semibold"
    >
      Show closable toast
    </button>
    <Toaster closeButton />
  </>
);
