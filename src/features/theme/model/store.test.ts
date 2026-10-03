import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  applyTheme,
  followSystemTheme,
  resolveTheme,
  useThemeStore,
} from "./store";

/** Make the OS report a dark (or light) colour scheme. */
const osPrefersDark = (dark: boolean) =>
  vi.mocked(window.matchMedia).mockImplementation(
    (query: string) =>
      ({
        matches: dark,
        media: query,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      }) as unknown as MediaQueryList,
  );

beforeEach(() => {
  useThemeStore.setState({ theme: "system" });
  document.documentElement.dataset.theme = undefined;
  osPrefersDark(false);
});

afterEach(() => localStorage.clear());

describe("useThemeStore", () => {
  it("starts on the system theme", () => {
    expect(useThemeStore.getState().theme).toBe("system");
  });

  it("setTheme() stores the choice and paints it", () => {
    useThemeStore.getState().setTheme("dark");
    expect(useThemeStore.getState().theme).toBe("dark");
    expect(document.documentElement.dataset.theme).toBe("dark");
  });

  it("migrates the pre-shadcn 'cmyk' value to light", async () => {
    localStorage.setItem(
      "litefront-theme",
      JSON.stringify({ state: { theme: "cmyk" }, version: 0 }),
    );
    await useThemeStore.persist.rehydrate();
    expect(useThemeStore.getState().theme).toBe("light");
    expect(document.documentElement.dataset.theme).toBe("light");
  });

  it("keeps a persisted dark choice through the migration", async () => {
    localStorage.setItem(
      "litefront-theme",
      JSON.stringify({ state: { theme: "dark" }, version: 0 }),
    );
    await useThemeStore.persist.rehydrate();
    expect(useThemeStore.getState().theme).toBe("dark");
  });
});

describe("resolveTheme / applyTheme", () => {
  it("passes an explicit choice through", () => {
    osPrefersDark(true);
    expect(resolveTheme("light")).toBe("light");
    expect(resolveTheme("dark")).toBe("dark");
  });

  it("resolves 'system' against the OS setting", () => {
    expect(resolveTheme("system")).toBe("light");
    osPrefersDark(true);
    expect(resolveTheme("system")).toBe("dark");
  });

  it("paints the resolved theme, never 'system', without touching the store", () => {
    osPrefersDark(true);
    applyTheme("system");
    expect(document.documentElement.dataset.theme).toBe("dark");
    expect(useThemeStore.getState().theme).toBe("system");
  });
});

describe("followSystemTheme", () => {
  it("repaints on an OS change and unsubscribes on cleanup", () => {
    let listener: (() => void) | undefined;
    const removeEventListener = vi.fn();
    vi.mocked(window.matchMedia).mockImplementation(
      (query: string) =>
        ({
          matches: true,
          media: query,
          addEventListener: (_: string, fn: () => void) => {
            listener = fn;
          },
          removeEventListener,
        }) as unknown as MediaQueryList,
    );

    const stop = followSystemTheme();
    listener?.();
    expect(document.documentElement.dataset.theme).toBe("dark");

    stop();
    expect(removeEventListener).toHaveBeenCalledWith("change", listener);
  });
});
