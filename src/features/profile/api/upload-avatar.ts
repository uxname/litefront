import { env } from "@shared/config";

interface UploadedFile {
  filename: string;
  /**
   * Absolute URL the browser downloads the object from — never a path to join
   * onto. Unless the backend runs in public file mode it is a SIGNED link that
   * expires (`FILE_LINK_TTL_MINUTES`), so it is for showing the file now, not
   * for keeping.
   */
  path: string;
  /** The object's permanent name in storage — what a signed link is signed for. */
  key: string;
}

/** Backend REST error envelope (`internal/httperr`): `{ statusCode, message }`. */
interface UploadErrorBody {
  statusCode?: number;
  message?: string;
}

/** Abort the upload if the backend hangs, so the form never stays stuck. */
const UPLOAD_TIMEOUT_MS = 30_000;

/**
 * Upload an avatar image to the backend REST endpoint (`POST /upload`) and
 * return the URL the browser can load it from right now.
 *
 * The GraphQL server has no upload mutation, so this talks to the same origin
 * as the GraphQL endpoint. The returned link is handed straight back to
 * `updateProfile`: the backend recognises its own link, stores the permanent
 * object behind it, and signs a fresh link on every read — which is why nothing
 * here has to care that this one expires.
 */
export const uploadAvatar = async (
  file: File,
  accessToken?: string,
): Promise<string> => {
  const origin = new URL(env.VITE_GRAPHQL_API_URL).origin;
  const body = new FormData();
  body.append("file", file);

  const response = await fetch(`${origin}/upload`, {
    method: "POST",
    headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
    body,
    signal: AbortSignal.timeout(UPLOAD_TIMEOUT_MS),
  });

  if (!response.ok) {
    // Surface the server's reason (e.g. "file too large", "disallowed mime
    // type") instead of a bare status code, when the body carries one.
    let detail = "";
    try {
      const errorBody = (await response.json()) as UploadErrorBody;
      if (errorBody?.message) detail = `: ${errorBody.message}`;
    } catch {
      // Non-JSON / empty error body — fall back to the status code alone.
    }
    throw new Error(`Upload failed with status ${response.status}${detail}`);
  }

  const files = (await response.json()) as UploadedFile[];
  const uploaded = files[0];
  if (!uploaded?.path) {
    throw new Error("Upload response did not contain a file path");
  }

  // Returned as-is: the file lives in object storage, not behind this API, so
  // prefixing the API origin would build a dead "https://api/http://storage/…".
  // Signature and all — the backend strips what it must before storing it.
  return uploaded.path;
};
