import { describe, expect, it } from "vitest";
import { profileFormSchema } from "./schema";

/**
 * Boundary coverage for the profile form schema. Constraints mirror the backend
 * constants in `backend/internal/config/constants.go`: displayName trimmed ≤100,
 * bio trimmed ≤1000, avatarUrl is either "" or a valid URL ≤2048. All three
 * fields are optional. Update these numbers together with those constants.
 */
describe("profileFormSchema", () => {
  describe("valid inputs", () => {
    it("accepts a fully-populated, in-bounds object", () => {
      const result = profileFormSchema.safeParse({
        displayName: "Ada Lovelace",
        bio: "Mathematician.",
        avatarUrl: "https://example.com/a.png",
      });
      expect(result.success).toBe(true);
    });

    it("accepts an empty object (all fields optional)", () => {
      expect(profileFormSchema.safeParse({}).success).toBe(true);
    });

    it("accepts empty strings for displayName and bio", () => {
      const result = profileFormSchema.safeParse({
        displayName: "",
        bio: "",
        avatarUrl: "",
      });
      expect(result.success).toBe(true);
    });

    it("trims surrounding whitespace from displayName", () => {
      const result = profileFormSchema.safeParse({ displayName: "  Ada  " });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.displayName).toBe("Ada");
      }
    });

    it("trims surrounding whitespace from bio", () => {
      const result = profileFormSchema.safeParse({ bio: "  hi  " });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.bio).toBe("hi");
      }
    });
  });

  describe("displayName", () => {
    it("accepts exactly 100 characters (upper boundary)", () => {
      const result = profileFormSchema.safeParse({
        displayName: "a".repeat(100),
      });
      expect(result.success).toBe(true);
    });

    it("rejects 101 characters with a displayName error", () => {
      const result = profileFormSchema.safeParse({
        displayName: "a".repeat(101),
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.path).toEqual(["displayName"]);
      }
    });

    it("counts length after trimming (trailing space does not push over 100)", () => {
      // 100 chars + trailing space → trimmed to 100, should pass.
      const result = profileFormSchema.safeParse({
        displayName: `${"a".repeat(100)} `,
      });
      expect(result.success).toBe(true);
    });
  });

  describe("bio", () => {
    it("accepts exactly 1000 characters (upper boundary)", () => {
      const result = profileFormSchema.safeParse({ bio: "a".repeat(1000) });
      expect(result.success).toBe(true);
    });

    it("rejects 1001 characters with a bio error", () => {
      const result = profileFormSchema.safeParse({ bio: "a".repeat(1001) });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.path).toEqual(["bio"]);
      }
    });
  });

  describe("avatarUrl", () => {
    it("accepts an empty string", () => {
      expect(profileFormSchema.safeParse({ avatarUrl: "" }).success).toBe(true);
    });

    it("accepts a valid http URL", () => {
      expect(
        profileFormSchema.safeParse({ avatarUrl: "http://x.io/a.jpg" }).success,
      ).toBe(true);
    });

    it("accepts a valid https URL", () => {
      expect(
        profileFormSchema.safeParse({ avatarUrl: "https://x.io/a.jpg" })
          .success,
      ).toBe(true);
    });

    it("rejects a non-URL string with an avatarUrl error", () => {
      const result = profileFormSchema.safeParse({ avatarUrl: "not-a-url" });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.path).toEqual(["avatarUrl"]);
      }
    });

    it("rejects a URL longer than 2048 characters", () => {
      const longUrl = `https://x.io/${"a".repeat(2048)}`;
      const result = profileFormSchema.safeParse({ avatarUrl: longUrl });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.path).toEqual(["avatarUrl"]);
      }
    });
  });

  describe("type coercion", () => {
    it("rejects a non-string displayName", () => {
      const result = profileFormSchema.safeParse({ displayName: 123 });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.path).toEqual(["displayName"]);
      }
    });

    it("rejects a non-string bio", () => {
      const result = profileFormSchema.safeParse({ bio: false });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.path).toEqual(["bio"]);
      }
    });
  });
});
