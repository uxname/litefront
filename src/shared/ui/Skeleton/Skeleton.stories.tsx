import type { Meta, StoryFn } from "@storybook/react-vite";
import { Skeleton } from "./Skeleton";

export default { component: Skeleton } satisfies Meta<typeof Skeleton>;

export const Line: StoryFn = () => <Skeleton variant="line" />;

export const Circle: StoryFn = () => (
  <Skeleton variant="circle" width={48} height={48} />
);

export const Rect: StoryFn = () => <Skeleton variant="rect" height={120} />;

export const CustomSize: StoryFn = () => (
  <Skeleton variant="line" width="50%" height={24} />
);

export const TextBlock: StoryFn = () => (
  <div className="flex w-64 flex-col gap-2">
    <Skeleton variant="line" width="80%" />
    <Skeleton variant="line" />
    <Skeleton variant="line" width="60%" />
  </div>
);

export const Avatar: StoryFn = () => (
  <div className="flex items-center gap-3">
    <Skeleton variant="circle" width={40} height={40} />
    <div className="flex flex-1 flex-col gap-2">
      <Skeleton variant="line" width="70%" />
      <Skeleton variant="line" width="40%" />
    </div>
  </div>
);

export const Card: StoryFn = () => (
  <div className="flex w-72 flex-col gap-3">
    <Skeleton variant="rect" height={160} />
    <Skeleton variant="line" width="90%" />
    <Skeleton variant="line" width="60%" />
  </div>
);
