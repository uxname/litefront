import { describe, expect, it } from "vitest";
import { sentryTags } from "./tags";

describe("sentryTags", () => {
  it("files reports under the runtime environment and version", () => {
    expect(
      sentryTags({
        VITE_APP_ENV: "staging",
        VITE_APP_VERSION: "1.4.0",
        MODE: "production",
      }),
    ).toEqual({ environment: "staging", release: "1.4.0" });
  });

  it("falls back to the build mode and a development release", () => {
    expect(
      sentryTags({
        VITE_APP_ENV: "",
        VITE_APP_VERSION: "",
        MODE: "production",
      }),
    ).toEqual({ environment: "production", release: "development" });
  });
});
