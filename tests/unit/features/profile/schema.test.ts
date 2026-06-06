import { describe, expect, it, vi } from "vitest";

// Validation messages are looked up via paraglide; return the key name so the
// schema can build without the full message bundle.
vi.mock("@generated/paraglide/messages", () => ({
  m: new Proxy({}, { get: (_t, key: string) => () => key }),
}));

const { profileFormSchema } = await import("@features/profile/model/schema");

describe("profileFormSchema", () => {
  it("accepts an empty object (all fields optional)", () => {
    expect(profileFormSchema.safeParse({}).success).toBe(true);
  });

  it("accepts a valid avatar URL", () => {
    const result = profileFormSchema.safeParse({
      avatarUrl: "https://cdn.example.com/a.png",
    });
    expect(result.success).toBe(true);
  });

  it("accepts an empty avatarUrl string (means unchanged)", () => {
    expect(profileFormSchema.safeParse({ avatarUrl: "" }).success).toBe(true);
  });

  it("rejects an invalid avatar URL", () => {
    expect(
      profileFormSchema.safeParse({ avatarUrl: "not-a-url" }).success,
    ).toBe(false);
  });

  it("rejects a display name longer than 80 chars", () => {
    expect(
      profileFormSchema.safeParse({ displayName: "x".repeat(81) }).success,
    ).toBe(false);
  });

  it("rejects a bio longer than 500 chars", () => {
    expect(profileFormSchema.safeParse({ bio: "x".repeat(501) }).success).toBe(
      false,
    );
  });

  it("accepts display name and bio within limits", () => {
    expect(
      profileFormSchema.safeParse({ displayName: "Ann", bio: "Hello" }).success,
    ).toBe(true);
  });
});
