import { describe, expect, it, vi } from "vitest";
import { signOut } from "./sign-out";

const authWith = (revoke: () => Promise<void>) => ({
  user: { id_token: "id-tok" },
  revokeTokens: vi.fn(revoke),
  removeUser: vi.fn(async () => {}),
  signoutRedirect: vi.fn(async () => {}),
});

describe("signOut", () => {
  // With revokeTokensOnSignout the library revoked first and removed the user
  // after — so a failed revocation (IdP down, CORS, no revocation endpoint)
  // aborted sign-out and left the tokens in localStorage.
  it("removes the local session even when revocation fails", async () => {
    const auth = authWith(async () => {
      throw new TypeError("Failed to fetch");
    });

    await signOut(auth as never);

    expect(auth.removeUser).toHaveBeenCalledOnce();
    expect(auth.signoutRedirect).toHaveBeenCalledWith({
      id_token_hint: "id-tok",
    });
  });

  it("revokes, then removes, then ends the IdP session", async () => {
    const order: string[] = [];
    const auth = {
      user: { id_token: "id-tok" },
      revokeTokens: vi.fn(async () => {
        order.push("revoke");
      }),
      removeUser: vi.fn(async () => {
        order.push("remove");
      }),
      signoutRedirect: vi.fn(async () => {
        order.push("redirect");
      }),
    };

    await signOut(auth as never);

    expect(order).toEqual(["revoke", "remove", "redirect"]);
  });
});
