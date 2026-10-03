import type { Meta, StoryFn } from "@storybook/react-vite";
import { User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";

export default { component: Avatar } satisfies Meta<typeof Avatar>;

// An inline SVG: a story must not depend on the network.
const PICTURE =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1 1'%3E%3Crect width='1' height='1' fill='%230ea5e9'/%3E%3C/svg%3E";

export const WithImage: StoryFn = () => (
  <Avatar className="size-16">
    <AvatarImage src={PICTURE} alt="Ada Lovelace" />
    <AvatarFallback>AL</AvatarFallback>
  </Avatar>
);

export const InitialsFallback: StoryFn = () => (
  <Avatar>
    <AvatarFallback>AL</AvatarFallback>
  </Avatar>
);

export const IconFallback: StoryFn = () => (
  <Avatar className="size-16 border">
    <AvatarFallback>
      <User className="size-7 text-muted-foreground" />
    </AvatarFallback>
  </Avatar>
);
