/** Join truthy class name parts into a single string. */
export const cn = (
  ...parts: Array<string | false | null | undefined>
): string => parts.filter(Boolean).join(" ");
