export const normalizeError = (error: unknown): Error => {
  if (error instanceof Error) return error;
  try {
    const message = typeof error === "string" ? error : JSON.stringify(error);
    return new Error(message || "Unknown error occurred");
  } catch {
    return new Error("Non-serializable error (circular or BigInt)");
  }
};
