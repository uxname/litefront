import { Client } from "urql";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// Sentry is a side-effecting dependency (network/transport). The error
// exchange only references captureException, so a no-op spy is enough.
vi.mock("@shared/lib/sentry", () => ({
  captureException: vi.fn(),
}));

// Spy on urql's Client constructor while keeping the real implementation, so
// `instanceof Client` still holds AND we can inspect the config it was built with.
const clientSpy = vi.fn();
vi.mock("urql", async (importOriginal) => {
  const actual = await importOriginal<typeof import("urql")>();
  class SpiedClient extends actual.Client {
    constructor(args: ConstructorParameters<typeof actual.Client>[0]) {
      clientSpy(args);
      super(args);
    }
  }
  return { ...actual, Client: SpiedClient };
});

import { createGraphQLClient } from "./graphql-client";

afterEach(() => {
  vi.clearAllMocks();
});

describe("createGraphQLClient", () => {
  beforeEach(() => {
    clientSpy.mockClear();
  });

  it("returns a urql Client instance", () => {
    const client = createGraphQLClient();
    expect(client).toBeTruthy();
    expect(client).toBeInstanceOf(Client);
  });

  it("configures the client with the GraphQL API url from env", () => {
    createGraphQLClient();
    expect(clientSpy).toHaveBeenCalledOnce();
    expect(clientSpy.mock.calls[0][0]).toMatchObject({
      url: "http://localhost:4000/graphql",
    });
  });

  it("uses the cache-and-network request policy", () => {
    createGraphQLClient();
    expect(clientSpy.mock.calls[0][0]).toMatchObject({
      requestPolicy: "cache-and-network",
    });
  });

  it("builds without throwing when no access token is provided", () => {
    expect(() => createGraphQLClient()).not.toThrow();
  });

  it("builds without throwing when an access token is provided", () => {
    expect(() => createGraphQLClient("test-token")).not.toThrow();
  });

  it("sets the Authorization header when an access token is provided", () => {
    createGraphQLClient("test-token");
    const args = clientSpy.mock.calls[0][0];
    // fetchOptions is a function so each request gets a fresh abort signal.
    expect(args.fetchOptions()).toMatchObject({
      headers: { Authorization: "Bearer test-token" },
    });
  });

  it("omits the Authorization header when no access token is provided", () => {
    createGraphQLClient();
    const args = clientSpy.mock.calls[0][0];
    expect(args.fetchOptions().headers).toEqual({});
  });
});
