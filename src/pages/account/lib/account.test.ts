import { describe, expect, it } from "vitest";
import {
  buildSecurityActions,
  formatMemberSince,
  resolveAvatarUrl,
  resolveDisplayName,
  resolveEmail,
  resolveEmailVerified,
  roleLabel,
} from "./account";

describe("buildSecurityActions", () => {
  it("lists the four self-service actions in order", () => {
    const actions = buildSecurityActions();
    expect(actions.map((a) => a.action)).toEqual([
      "email",
      "password",
      "authenticator-app",
      "passkey/add",
    ]);
  });

  it("resolves each title through paraglide", () => {
    // The global setup mocks m.* to return the literal message key.
    const titles = buildSecurityActions().map((a) => a.title);
    expect(titles).toEqual([
      "change_email",
      "change_password",
      "manage_mfa",
      "manage_passkey",
    ]);
  });

  it("attaches a lucide icon component to every action", () => {
    for (const { icon } of buildSecurityActions()) {
      expect(icon).toBeTypeOf("object");
    }
  });
});

describe("resolveAvatarUrl", () => {
  it("prefers the backend avatarUrl", () => {
    expect(
      resolveAvatarUrl({ avatarUrl: "be.png" }, { picture: "claim.png" }),
    ).toBe("be.png");
  });

  it("falls back to a string picture claim", () => {
    expect(
      resolveAvatarUrl({ avatarUrl: null }, { picture: "claim.png" }),
    ).toBe("claim.png");
  });

  it("ignores a non-string picture claim", () => {
    expect(resolveAvatarUrl({ avatarUrl: null }, { picture: 42 })).toBeNull();
  });

  it("returns null when nothing is available", () => {
    expect(resolveAvatarUrl(null, null)).toBeNull();
    expect(resolveAvatarUrl(undefined, undefined)).toBeNull();
    expect(resolveAvatarUrl({ avatarUrl: null }, {})).toBeNull();
  });
});

describe("resolveDisplayName", () => {
  it("prefers the backend displayName", () => {
    expect(
      resolveDisplayName(
        { displayName: "Ada" },
        { name: "Claim Name", email: "a@b.c" },
      ),
    ).toBe("Ada");
  });

  it("falls back to a string name claim", () => {
    expect(
      resolveDisplayName(
        { displayName: null },
        { name: "Claim Name", email: "a@b.c" },
      ),
    ).toBe("Claim Name");
  });

  it("falls back to the email claim when name is absent or non-string", () => {
    expect(
      resolveDisplayName({ displayName: null }, { name: 99, email: "a@b.c" }),
    ).toBe("a@b.c");
    expect(resolveDisplayName({ displayName: null }, { email: "a@b.c" })).toBe(
      "a@b.c",
    );
  });

  it("returns undefined when no source resolves to a string", () => {
    expect(resolveDisplayName(null, null)).toBeUndefined();
    expect(resolveDisplayName({ displayName: null }, {})).toBeUndefined();
    expect(
      resolveDisplayName({ displayName: null }, { name: 1, email: 2 }),
    ).toBeUndefined();
  });
});

describe("resolveEmail", () => {
  it("returns a string email claim", () => {
    expect(resolveEmail({ email: "a@b.c" })).toBe("a@b.c");
  });

  it("returns undefined for a missing or non-string email", () => {
    expect(resolveEmail(null)).toBeUndefined();
    expect(resolveEmail(undefined)).toBeUndefined();
    expect(resolveEmail({})).toBeUndefined();
    expect(resolveEmail({ email: 123 })).toBeUndefined();
  });
});

describe("resolveEmailVerified", () => {
  it("returns the boolean email_verified claim", () => {
    expect(resolveEmailVerified({ email_verified: true })).toBe(true);
    expect(resolveEmailVerified({ email_verified: false })).toBe(false);
  });

  it("returns undefined for a missing or non-boolean value", () => {
    expect(resolveEmailVerified(null)).toBeUndefined();
    expect(resolveEmailVerified(undefined)).toBeUndefined();
    expect(resolveEmailVerified({})).toBeUndefined();
    expect(resolveEmailVerified({ email_verified: "true" })).toBeUndefined();
  });
});

describe("formatMemberSince", () => {
  it("formats a timestamp as a stable UTC YYYY-MM-DD string", () => {
    // Deterministic across runtime locale/timezone (no hydration mismatch).
    expect(formatMemberSince("2024-01-15T00:00:00.000Z")).toBe("2024-01-15");
    // A late-evening UTC instant still maps to the same UTC calendar day.
    expect(formatMemberSince("2024-01-15T23:30:00.000Z")).toBe("2024-01-15");
  });

  it("returns undefined for an empty, missing or invalid value", () => {
    expect(formatMemberSince(undefined)).toBeUndefined();
    expect(formatMemberSince(null)).toBeUndefined();
    expect(formatMemberSince("")).toBeUndefined();
    expect(formatMemberSince("not-a-date")).toBeUndefined();
  });
});

describe("roleLabel", () => {
  it("labels ADMIN with the admin message", () => {
    expect(roleLabel("ADMIN")).toBe("role_admin");
  });

  it("labels any non-admin role with the user message", () => {
    expect(roleLabel("USER")).toBe("role_user");
    expect(roleLabel("SOMETHING_ELSE")).toBe("role_user");
  });
});
