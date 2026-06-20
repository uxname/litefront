import { beforeEach, describe, expect, it } from "vitest";
import { applyTheme, useThemeStore } from "./store";

beforeEach(() => {
  useThemeStore.setState({ theme: "cmyk" });
  document.documentElement.dataset.theme = undefined;
});

describe("useThemeStore", () => {
  it("starts on the cmyk theme", () => {
    expect(useThemeStore.getState().theme).toBe("cmyk");
  });

  it("toggle() flips from cmyk to dark", () => {
    useThemeStore.getState().toggle();
    expect(useThemeStore.getState().theme).toBe("dark");
  });

  it("toggle() flips back from dark to cmyk", () => {
    useThemeStore.setState({ theme: "dark" });
    useThemeStore.getState().toggle();
    expect(useThemeStore.getState().theme).toBe("cmyk");
  });

  it("toggle() writes the next theme to document.documentElement.dataset.theme", () => {
    useThemeStore.getState().toggle();
    expect(document.documentElement.dataset.theme).toBe("dark");
  });

  it("setTheme() sets the given theme in the store", () => {
    useThemeStore.getState().setTheme("dark");
    expect(useThemeStore.getState().theme).toBe("dark");
  });

  it("setTheme() writes the given theme to the document dataset", () => {
    useThemeStore.getState().setTheme("dark");
    expect(document.documentElement.dataset.theme).toBe("dark");
  });

  it("applyTheme() updates the document dataset without touching the store", () => {
    applyTheme("dark");
    expect(document.documentElement.dataset.theme).toBe("dark");
    expect(useThemeStore.getState().theme).toBe("cmyk");
  });
});
