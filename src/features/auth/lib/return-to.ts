/**
 * The in-app path to return to after sign-in, or "/" for anything that is not
 * one: only a single-slash absolute path is kept, so a value like
 * "//evil.example" or "https://…" can never send the user off-site.
 */
export const safeReturnTo = (value: unknown): string =>
  typeof value === "string" && /^\/(?![/\\])/.test(value) ? value : "/";
