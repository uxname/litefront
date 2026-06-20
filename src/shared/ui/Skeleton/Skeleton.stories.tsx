import type { Story } from "@ladle/react";
import { Skeleton } from "./Skeleton";

export const Line: Story = () => <Skeleton variant="line" />;

export const Circle: Story = () => (
  <Skeleton variant="circle" width={48} height={48} />
);

export const Rect: Story = () => <Skeleton variant="rect" height={120} />;

export const CustomSize: Story = () => (
  <Skeleton variant="line" width="50%" height={24} />
);

export const TextBlock: Story = () => (
  <div className="flex w-64 flex-col gap-2">
    <Skeleton variant="line" width="80%" />
    <Skeleton variant="line" />
    <Skeleton variant="line" width="60%" />
  </div>
);

export const Avatar: Story = () => (
  <div className="flex items-center gap-3">
    <Skeleton variant="circle" width={40} height={40} />
    <div className="flex flex-1 flex-col gap-2">
      <Skeleton variant="line" width="70%" />
      <Skeleton variant="line" width="40%" />
    </div>
  </div>
);

export const Card: Story = () => (
  <div className="flex w-72 flex-col gap-3">
    <Skeleton variant="rect" height={160} />
    <Skeleton variant="line" width="90%" />
    <Skeleton variant="line" width="60%" />
  </div>
);
