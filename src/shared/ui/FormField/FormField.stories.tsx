import type { Story } from "@ladle/react";
import { FormField } from "./FormField";

export const Default: Story = () => (
  <FormField htmlFor="email" label="Email">
    <input
      id="email"
      type="email"
      className="rounded-lg border border-base-300 px-3 py-2 text-sm"
      placeholder="you@example.com"
    />
  </FormField>
);

export const WithHint: Story = () => (
  <FormField
    htmlFor="username"
    label="Username"
    hint="Letters and numbers only"
  >
    <input
      id="username"
      className="rounded-lg border border-base-300 px-3 py-2 text-sm"
    />
  </FormField>
);

export const Required: Story = () => (
  <FormField htmlFor="password" label="Password" required>
    <input
      id="password"
      type="password"
      className="rounded-lg border border-base-300 px-3 py-2 text-sm"
    />
  </FormField>
);

export const WithError: Story = () => (
  <FormField
    htmlFor="email-err"
    label="Email"
    error="That email address is already taken"
  >
    <input
      id="email-err"
      type="email"
      aria-describedby="email-err-error"
      className="rounded-lg border border-error px-3 py-2 text-sm"
    />
  </FormField>
);

export const ErrorOverridesHint: Story = () => (
  <FormField
    htmlFor="phone"
    label="Phone"
    hint="Include your country code"
    error="Not a valid phone number"
  >
    <input
      id="phone"
      type="tel"
      aria-describedby="phone-error"
      className="rounded-lg border border-error px-3 py-2 text-sm"
    />
  </FormField>
);

export const RequiredWithHint: Story = () => (
  <FormField
    htmlFor="full-name"
    label="Full name"
    hint="As it appears on your ID"
    required
  >
    <input
      id="full-name"
      className="rounded-lg border border-base-300 px-3 py-2 text-sm"
    />
  </FormField>
);

export const WithTextarea: Story = () => (
  <FormField htmlFor="bio" label="Bio" hint="Tell us about yourself">
    <textarea
      id="bio"
      rows={4}
      className="rounded-lg border border-base-300 px-3 py-2 text-sm"
    />
  </FormField>
);
