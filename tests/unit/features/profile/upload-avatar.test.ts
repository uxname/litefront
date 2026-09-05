import { uploadAvatar } from "@features/profile";
import { afterEach, describe, expect, it, vi } from "vitest";

// Pin the config with a value that is visibly NOT the developer's .env: an
// expectation computed from the same variable the code reads is green whatever
// the code does. The literals below are the actual contract.
vi.mock("@shared/config", () => ({
  env: { VITE_GRAPHQL_API_URL: "https://api.test/graphql" },
}));

const makeFile = () => new File(["x"], "avatar.png", { type: "image/png" });

const stubUpload = (path: string) => {
  const fetchMock = vi.fn().mockResolvedValue({
    ok: true,
    json: async () => [{ filename: "avatar.png", path }],
  });
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
};

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("uploadAvatar", () => {
  // The backend stores uploads in S3-compatible storage and answers with the
  // object's public URL, so the frontend must pass it through untouched.
  // Prefixing the API origin would produce
  // "https://api.test/http://storage.test:3900/…" — a dead link.
  it("C6: returns the absolute storage URL from the backend unchanged", async () => {
    const fetchMock = stubUpload(
      "http://storage.test:3900/uploads/2026/09/05/12-30/9f1c.png",
    );

    const url = await uploadAvatar(makeFile(), "tok");

    expect(url).toBe(
      "http://storage.test:3900/uploads/2026/09/05/12-30/9f1c.png",
    );
    // The upload endpoint itself still lives on the API origin.
    expect(fetchMock.mock.calls[0][0]).toBe("https://api.test/upload");
  });

  it("C6: does not concatenate the API origin with a URL on another scheme", async () => {
    stubUpload("https://cdn.other.test/uploads/9f1c.png");

    const url = await uploadAvatar(makeFile());

    expect(url).toBe("https://cdn.other.test/uploads/9f1c.png");
    expect(url).not.toContain("api.test");
  });
});
