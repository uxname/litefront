import { env } from "@shared/config";

interface UploadedFile {
  filename: string;
  path: string;
}

/**
 * Upload an avatar image to the backend REST endpoint (`POST /upload`) and
 * return the absolute, publicly-servable URL of the stored file.
 *
 * The GraphQL server has no upload mutation, so this talks to the same origin
 * as the GraphQL endpoint. The returned URL is then saved via `updateProfile`.
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
  });

  if (!response.ok) {
    throw new Error(`Upload failed with status ${response.status}`);
  }

  const files = (await response.json()) as UploadedFile[];
  const uploaded = files[0];
  if (!uploaded?.path) {
    throw new Error("Upload response did not contain a file path");
  }

  return `${origin}${uploaded.path}`;
};
