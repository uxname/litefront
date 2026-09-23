import type { AuthContextProps } from "react-oidc-context";

/** How long sign-out waits for the IdP to confirm revocation. */
export const REVOKE_TIMEOUT_MS = 3000;

type SignOutAuth = Pick<
  AuthContextProps,
  "user" | "revokeTokens" | "removeUser" | "signoutRedirect"
>;

/**
 * Sign out so that the local session always ends: revoke the tokens at the IdP
 * (best effort), remove them from this browser — which also signs the other
 * tabs out, see AuthObserver — then end the IdP session.
 *
 * Not the library's `revokeTokensOnSignout`: it revokes first and removes the
 * user after, so a failed revocation (IdP down, CORS, no revocation endpoint)
 * aborted the whole sign-out and left the tokens in localStorage. A hung
 * revocation request is not waited on past {@link REVOKE_TIMEOUT_MS} either.
 */
export const signOut = async (auth: SignOutAuth): Promise<void> => {
  const idTokenHint = auth.user?.id_token;
  try {
    await Promise.race([
      auth.revokeTokens(),
      new Promise((resolve) => setTimeout(resolve, REVOKE_TIMEOUT_MS)),
    ]);
  } catch {
    // Best effort: the tokens still expire, and the local copy goes below.
  }
  await auth.removeUser();
  await auth.signoutRedirect({ id_token_hint: idTokenHint });
};
