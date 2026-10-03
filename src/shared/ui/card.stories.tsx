import type { Meta, StoryFn } from "@storybook/react-vite";
import { Button } from "./button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./card";

export default { component: Card } satisfies Meta<typeof Card>;

export const Default: StoryFn = () => (
  <Card className="max-w-md">
    <CardHeader>
      <CardTitle>Edit profile</CardTitle>
      <CardDescription>Your identity and account settings.</CardDescription>
    </CardHeader>
    <CardContent className="text-sm">Card body content.</CardContent>
  </Card>
);

export const DividedHeaderWithAction: StoryFn = () => (
  <Card className="max-w-md">
    <CardHeader className="border-b">
      <CardTitle>Account & security</CardTitle>
      <CardAction>
        <Button size="sm" variant="outline">
          Manage
        </Button>
      </CardAction>
    </CardHeader>
    <CardContent className="text-sm">Rows go here.</CardContent>
    <CardFooter className="justify-end">
      <Button size="sm">Save</Button>
    </CardFooter>
  </Card>
);

export const ContentOnly: StoryFn = () => (
  <Card className="max-w-xs">
    <CardContent className="text-sm">A card without a header.</CardContent>
  </Card>
);
