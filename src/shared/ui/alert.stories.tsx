import type { Meta, StoryFn } from "@storybook/react-vite";
import { AlertCircle, Info } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "./alert";

export default { component: Alert } satisfies Meta<typeof Alert>;

export const Default: StoryFn = () => (
  <Alert className="max-w-md">
    <Info />
    <AlertTitle>Heads up</AlertTitle>
    <AlertDescription>Your changes are saved automatically.</AlertDescription>
  </Alert>
);

export const Destructive: StoryFn = () => (
  <Alert variant="destructive" className="max-w-md">
    <AlertCircle />
    <AlertTitle>Failed to load profile</AlertTitle>
    <AlertDescription>Check your connection and try again.</AlertDescription>
  </Alert>
);
