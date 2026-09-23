/**
 * The in-app path to return to after sign-in, or "/" for anything that is not
 * one: only a single-slash absolute path is kept, so a value like
 * "//evil.example" or "https://…" can never send the user off-site. Control
 * characters are refused too: the URL parser drops tabs and newlines, which
 * turns "/\t/evil.example" into "//evil.example".
 */
export const safeReturnTo = (value: unknown): string =>
  typeof value === "string" &&
  /^\/(?![/\\])/.test(value) &&
  // biome-ignore lint/suspicious/noControlCharactersInRegex: matching them is the point
  !/[\u0000-\u001f\u007f]/.test(value)
    ? value
    : "/";
