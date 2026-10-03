import type { Meta, StoryFn } from "@storybook/react-vite";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "./field";
import { Input } from "./input";
import { Textarea } from "./textarea";

export default { component: Field } satisfies Meta<typeof Field>;

export const WithDescription: StoryFn = () => (
  <Field className="max-w-sm">
    <FieldLabel htmlFor="story-name">Display name</FieldLabel>
    <Input id="story-name" placeholder="How should we call you?" />
    <FieldDescription>Shown on your public profile.</FieldDescription>
  </Field>
);

export const Invalid: StoryFn = () => (
  <Field className="max-w-sm" data-invalid>
    <FieldLabel htmlFor="story-url">Website</FieldLabel>
    <Input
      id="story-url"
      aria-invalid
      aria-describedby="story-url-error"
      defaultValue="not a url"
    />
    <FieldError id="story-url-error">Must be a valid URL</FieldError>
  </Field>
);

export const Group: StoryFn = () => (
  <FieldGroup className="max-w-sm">
    <Field>
      <FieldLabel htmlFor="story-display">Display name</FieldLabel>
      <Input id="story-display" />
    </Field>
    <Field>
      <FieldLabel htmlFor="story-bio">Bio</FieldLabel>
      <Textarea id="story-bio" />
    </Field>
  </FieldGroup>
);
