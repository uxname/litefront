import { useThemeStore } from "@features/theme";
import { beforeEach, describe, expect, it } from "vitest";

describe("theme store", () => {
  beforeEach(() => {
    useThemeStore.setState({ theme: "cmyk" });
    delete document.documentElement.dataset.theme;
  });

  it("setTheme applies the theme to the document root", () => {
    useThemeStore.getState().setTheme("dark");
    expect(useThemeStore.getState().theme).toBe("dark");
    expect(document.documentElement.dataset.theme).toBe("dark");
  });

  it("toggle flips between cmyk and dark", () => {
    useThemeStore.getState().toggle();
    expect(useThemeStore.getState().theme).toBe("dark");
    expect(document.documentElement.dataset.theme).toBe("dark");

    useThemeStore.getState().toggle();
    expect(useThemeStore.getState().theme).toBe("cmyk");
    expect(document.documentElement.dataset.theme).toBe("cmyk");
  });
});
