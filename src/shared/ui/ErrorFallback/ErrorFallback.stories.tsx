import type { Meta, StoryFn } from "@storybook/react-vite";
import { ErrorFallback } from "./ErrorFallback";

export default { component: ErrorFallback } satisfies Meta<
  typeof ErrorFallback
>;

const noop = () => {};

export const Auth: StoryFn = () => (
  <ErrorFallback error={new Error("401 unauthorized")} reset={noop} />
);

export const Access: StoryFn = () => (
  <ErrorFallback error={new Error("403 forbidden")} reset={noop} />
);

export const AuthConfig: StoryFn = () => (
  <ErrorFallback
    error={new Error("Failed to load oidc-config from discovery endpoint")}
    reset={noop}
  />
);

export const Network: StoryFn = () => (
  <ErrorFallback
    error={new Error("Network request failed to fetch")}
    reset={noop}
  />
);

export const Server: StoryFn = () => (
  <ErrorFallback error={new Error("Internal Server Error 500")} reset={noop} />
);

export const Unknown: StoryFn = () => (
  <ErrorFallback
    error={new Error("Something unexpected happened")}
    reset={noop}
  />
);
