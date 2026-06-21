import { afterEach, describe, expect, it, vi } from "vitest";
import { uploadAvatar } from "./upload-avatar";

// env.VITE_GRAPHQL_API_URL resolves to http://localhost:4000/graphql in tests,
// so the upload endpoint origin is http://localhost:4000.
const ORIGIN = "http://localhost:4000";

const makeFile = () => new File(["x"], "avatar.png", { type: "image/png" });

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("uploadAvatar", () => {
  it("POSTs to <origin>/upload and returns the absolute file URL", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => [{ filename: "a.png", path: "/files/a.png" }],
    });
    vi.stubGlobal("fetch", fetchMock);

    const url = await uploadAvatar(makeFile(), "tok");

    expect(url).toBe(`${ORIGIN}/files/a.png`);
    const [calledUrl, init] = fetchMock.mock.calls[0];
    expect(calledUrl).toBe(`${ORIGIN}/upload`);
    expect(init.method).toBe("POST");
    expect(init.headers).toEqual({ Authorization: "Bearer tok" });
    expect(init.signal).toBeInstanceOf(AbortSignal);
  });

  it("omits the Authorization header when no token is provided", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => [{ filename: "a.png", path: "/files/a.png" }],
    });
    vi.stubGlobal("fetch", fetchMock);

    await uploadAvatar(makeFile());

    expect(fetchMock.mock.calls[0][1].headers).toEqual({});
  });

  it("surfaces the server message when the error body is JSON", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        status: 413,
        json: async () => ({ statusCode: 413, message: "file too large" }),
      }),
    );

    await expect(uploadAvatar(makeFile())).rejects.toThrow(
      "Upload failed with status 413: file too large",
    );
  });

  it("falls back to the status code when the error body is not JSON", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
        json: async () => {
          throw new Error("not json");
        },
      }),
    );

    await expect(uploadAvatar(makeFile())).rejects.toThrow(
      "Upload failed with status 500",
    );
  });

  it("throws when the response carries no file path", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => [],
      }),
    );

    await expect(uploadAvatar(makeFile())).rejects.toThrow(
      "did not contain a file path",
    );
  });
});
