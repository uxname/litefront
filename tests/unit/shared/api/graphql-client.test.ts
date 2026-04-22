import { type CombinedError } from "urql";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@shared/lib/sentry", () => ({
  captureException: vi.fn(),
  captureMessage: vi.fn(),
  initSentry: vi.fn(),
  setUser: vi.fn(),
  withScope: vi.fn(),
}));

// vi.hoisted makes refs available inside vi.mock factory closures (mock factories are hoisted before imports)
const refs = vi.hoisted(() => ({
  onError: undefined as ((error: CombinedError) => void) | undefined,
  clientOpts: undefined as Record<string, unknown> | undefined,
}));

vi.mock("urql", async (importOriginal) => {
  const actual = await importOriginal<typeof import("urql")>();
  return {
    ...actual,
    // urql v5 stores fetchOptions in a closure — capture constructor opts to inspect them
    // biome-ignore lint/complexity/useArrowFunction: arrow functions cannot be used with `new`
    Client: function (opts: Record<string, unknown>) {
      refs.clientOpts = opts;
      // biome-ignore lint/suspicious/noExplicitAny: urql Client constructor type is opaque
      return new actual.Client(opts as any);
    },
    errorExchange: (options: { onError: (error: CombinedError) => void }) => {
      refs.onError = options.onError;
      return actual.errorExchange(options);
    },
  };
});

import { createGraphQLClient } from "@shared/api/graphql-client";
import { captureException } from "@shared/lib/sentry";

describe("createGraphQLClient", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    refs.onError = undefined;
    refs.clientOpts = undefined;
  });

  it("does not include Authorization header for anonymous requests", () => {
    createGraphQLClient(undefined);
    const headers = (refs.clientOpts?.fetchOptions as RequestInit)?.headers as
      | Record<string, string>
      | undefined;
    expect(headers?.Authorization).toBeUndefined();
  });

  it("sets Authorization: Bearer <token> for authenticated requests", () => {
    createGraphQLClient("test-jwt-token");
    const headers = (refs.clientOpts?.fetchOptions as RequestInit)
      ?.headers as Record<string, string>;
    expect(headers.Authorization).toBe("Bearer test-jwt-token");
  });

  it("calls captureException with graphql source tag on error", () => {
    createGraphQLClient(undefined);

    const mockError = {
      message: "GraphQL Error",
      graphQLErrors: [{ message: "Some graphql error" }],
      networkError: undefined,
    } as unknown as CombinedError;

    refs.onError?.(mockError);

    expect(captureException).toHaveBeenCalledWith(mockError, {
      tags: { source: "graphql" },
      extra: {
        message: "GraphQL Error",
        graphQLErrors: [{ message: "Some graphql error" }],
        networkError: undefined,
      },
    });
  });

  it("includes networkError.message in extra when network error is present", () => {
    createGraphQLClient(undefined);

    const networkErr = new Error("Failed to fetch");
    const mockError = {
      message: "Network failure",
      graphQLErrors: [],
      networkError: networkErr,
    } as unknown as CombinedError;

    refs.onError?.(mockError);

    expect(captureException).toHaveBeenCalledWith(
      mockError,
      expect.objectContaining({
        extra: expect.objectContaining({
          networkError: "Failed to fetch",
        }),
      }),
    );
  });
});
