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
});
