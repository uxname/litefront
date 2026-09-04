import { describe, expect, it } from "vitest";
import { extractRequestId } from "./extractRequestId";

describe("extractRequestId", () => {
  it("reads the id the backend puts on a GraphQL error", () => {
    expect(
      extractRequestId({
        graphQLErrors: [
          { message: "boom", extensions: { requestId: "req-1" } },
        ],
      }),
    ).toBe("req-1");
  });

  it("skips errors that carry no id", () => {
    expect(
      extractRequestId({
        graphQLErrors: [
          { message: "no extensions" },
          { message: "boom", extensions: { requestId: "req-2" } },
        ],
      }),
    ).toBe("req-2");
  });

  it("returns undefined for anything that is not a GraphQL failure", () => {
    expect(extractRequestId(new Error("plain"))).toBeUndefined();
    expect(extractRequestId(null)).toBeUndefined();
    expect(extractRequestId("string error")).toBeUndefined();
    expect(extractRequestId({ graphQLErrors: "not an array" })).toBeUndefined();
    expect(
      extractRequestId({ graphQLErrors: [{ extensions: { requestId: 42 } }] }),
    ).toBeUndefined();
  });
});
