/**
 * Pulls the backend's `requestId` out of a failed GraphQL response.
 *
 * The backend puts it on every GraphQL error (`extensions.requestId`) and stamps
 * the same id on every server-side log line of that request, so it is the one
 * key that joins "the user saw this error" to "here is what the server did"
 * (see `backend/docs/DEBUGGING.md`). Showing it to the user is what makes a bug
 * report actionable instead of a screenshot.
 *
 * Duck-typed on purpose: `shared/ui` must not depend on the GraphQL client's
 * types, and anything without a request id simply yields `undefined`.
 */
export const extractRequestId = (error: unknown): string | undefined => {
  if (typeof error !== "object" || error === null) return undefined;

  const { graphQLErrors } = error as { graphQLErrors?: unknown };
  if (!Array.isArray(graphQLErrors)) return undefined;

  for (const gqlError of graphQLErrors) {
    const requestId = (
      gqlError as { extensions?: { requestId?: unknown } } | null
    )?.extensions?.requestId;
    if (typeof requestId === "string" && requestId !== "") return requestId;
  }
  return undefined;
};
