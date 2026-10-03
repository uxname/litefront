import type { Meta, StoryFn } from "@storybook/react-vite";
import { Skeleton } from "./skeleton";

export default { component: Skeleton } satisfies Meta<typeof Skeleton>;

export const Line: StoryFn = () => <Skeleton className="h-4 w-64" />;

export const Circle: StoryFn = () => (
  <Skeleton className="size-16 rounded-full" />
);

export const ProfileRow: StoryFn = () => (
  <div className="flex w-80 items-center gap-4">
    <Skeleton className="size-16 rounded-full" />
    <div className="flex-1 space-y-2">
      <Skeleton className="h-4 w-2/5" />
      <Skeleton className="h-4 w-3/5" />
    </div>
  </div>
);
