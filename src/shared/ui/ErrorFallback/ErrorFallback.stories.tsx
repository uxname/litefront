import type { Story } from "@ladle/react";
import { ErrorFallback } from "./ErrorFallback";

const noop = () => {};

export const Auth: Story = () => (
  <ErrorFallback error={new Error("401 unauthorized")} reset={noop} />
);

export const Access: Story = () => (
  <ErrorFallback error={new Error("403 forbidden")} reset={noop} />
);

export const AuthConfig: Story = () => (
  <ErrorFallback
    error={new Error("Failed to load oidc-config from discovery endpoint")}
    reset={noop}
  />
);

export const Network: Story = () => (
  <ErrorFallback
    error={new Error("Network request failed to fetch")}
    reset={noop}
  />
);

export const Server: Story = () => (
  <ErrorFallback error={new Error("Internal Server Error 500")} reset={noop} />
);

export const Unknown: Story = () => (
  <ErrorFallback
    error={new Error("Something unexpected happened")}
    reset={noop}
  />
);
