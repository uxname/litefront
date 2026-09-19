import { describe, expect, it } from "vitest";
import { detectErrorCategory } from "./detectErrorCategory";
import { ErrorCategory } from "./errorConfig";

describe("detectErrorCategory", () => {
  describe("AUTH", () => {
    it("detects a 401 status code", () => {
      expect(detectErrorCategory(new Error("Request failed with 401"))).toBe(
        ErrorCategory.AUTH,
      );
    });

    it("detects the word 'unauthorized'", () => {
      expect(detectErrorCategory(new Error("Unauthorized request"))).toBe(
        ErrorCategory.AUTH,
      );
    });

    it("detects a 'jwt' mention", () => {
      expect(detectErrorCategory(new Error("Invalid JWT token"))).toBe(
        ErrorCategory.AUTH,
      );
    });
  });

  describe("ACCESS", () => {
    it("detects a 403 status code", () => {
      expect(detectErrorCategory(new Error("Got 403 back"))).toBe(
        ErrorCategory.ACCESS,
      );
    });

    it("detects the word 'forbidden'", () => {
      expect(detectErrorCategory(new Error("Forbidden resource"))).toBe(
        ErrorCategory.ACCESS,
      );
    });
  });

  describe("AUTH_CONFIG", () => {
    it("detects an 'oidc-config' keyword", () => {
      expect(detectErrorCategory(new Error("Failed to load oidc-config"))).toBe(
        ErrorCategory.AUTH_CONFIG,
      );
    });

    it("detects a 'discovery' keyword", () => {
      expect(
        detectErrorCategory(new Error("OIDC discovery endpoint unreachable")),
      ).toBe(ErrorCategory.AUTH_CONFIG);
    });
  });

  describe("NETWORK", () => {
    it("detects the word 'network'", () => {
      expect(detectErrorCategory(new Error("Network error"))).toBe(
        ErrorCategory.NETWORK,
      );
    });

    it("detects the word 'fetch'", () => {
      expect(detectErrorCategory(new Error("Failed to fetch"))).toBe(
        ErrorCategory.NETWORK,
      );
    });

    it("detects a 503 status code", () => {
      expect(detectErrorCategory(new Error("Service 503 unavailable"))).toBe(
        ErrorCategory.NETWORK,
      );
    });
  });

  describe("SERVER", () => {
    it("detects a 500 status code", () => {
      expect(detectErrorCategory(new Error("Internal 500 error"))).toBe(
        ErrorCategory.SERVER,
      );
    });
  });

  describe("UNKNOWN", () => {
    it("falls back to UNKNOWN for an unrecognized message", () => {
      expect(detectErrorCategory(new Error("Something odd happened"))).toBe(
        ErrorCategory.UNKNOWN,
      );
    });

    it("falls back to UNKNOWN for an empty message", () => {
      expect(detectErrorCategory(new Error(""))).toBe(ErrorCategory.UNKNOWN);
    });
  });

  // The backend stamps a machine-readable `extensions.code` on every GraphQL
  // error, and urql hands those over on `graphQLErrors`. A plain Error with the
  // fields bolted on stands in for urql's CombinedError (which IS an Error), the
  // same duck typing extractRequestId.test.ts uses.
  describe("structured GraphQL errors", () => {
    const gqlError = (
      message: string,
      extra: { graphQLErrors?: unknown; networkError?: unknown },
    ): Error => Object.assign(new Error(message), extra);

    it.each([
      ["UNAUTHENTICATED", ErrorCategory.AUTH],
      ["FORBIDDEN", ErrorCategory.ACCESS],
      ["INTERNAL_SERVER_ERROR", ErrorCategory.SERVER],
    ])("maps the backend code %s", (code, category) => {
      expect(
        detectErrorCategory(
          gqlError("[GraphQL] whatever", {
            graphQLErrors: [{ extensions: { code } }],
          }),
        ),
      ).toBe(category);
    });

    it("trusts the code over a message that reads like something else", () => {
      // "fetch" and "500" are both in the text; the code says what happened.
      expect(
        detectErrorCategory(
          gqlError("[GraphQL] Failed to fetch 500 items", {
            graphQLErrors: [{ extensions: { code: "FORBIDDEN" } }],
          }),
        ),
      ).toBe(ErrorCategory.ACCESS);
    });

    it("skips errors without a known code and uses the first one that has it", () => {
      expect(
        detectErrorCategory(
          gqlError("[GraphQL] two errors", {
            graphQLErrors: [
              { message: "no extensions" },
              { extensions: { code: "BAD_USER_INPUT" } },
              { extensions: { code: "UNAUTHENTICATED" } },
            ],
          }),
        ),
      ).toBe(ErrorCategory.AUTH);
    });

    it("falls back to the message when no code is known", () => {
      expect(
        detectErrorCategory(
          gqlError("[GraphQL] displayName must be at most 100 characters", {
            graphQLErrors: [{ extensions: { code: "BAD_USER_INPUT" } }],
          }),
        ),
      ).toBe(ErrorCategory.UNKNOWN);
    });

    // No special case for `networkError`: urql prefixes such a message with
    // "[Network]", which the message rules below already read — and reading the
    // message first is what keeps a network-level 401 in AUTH.
    it("classifies a urql network failure by its message", () => {
      expect(
        detectErrorCategory(
          gqlError("[Network] Connection reset", {
            networkError: new Error("Connection reset"),
          }),
        ),
      ).toBe(ErrorCategory.NETWORK);
      expect(
        detectErrorCategory(
          gqlError("[Network] Unauthorized", {
            networkError: new Error("Unauthorized"),
          }),
        ),
      ).toBe(ErrorCategory.AUTH);
    });

    it("does not throw on malformed fields", () => {
      expect(
        detectErrorCategory(
          gqlError("Something odd happened", {
            graphQLErrors: "not an array",
          }),
        ),
      ).toBe(ErrorCategory.UNKNOWN);
      expect(
        detectErrorCategory(
          gqlError("Something odd happened", {
            graphQLErrors: [null, 42, { extensions: { code: 7 } }],
          }),
        ),
      ).toBe(ErrorCategory.UNKNOWN);
    });
  });
});
