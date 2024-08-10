import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { createJSONStorage, persist } from "zustand/middleware";

import { IAuthStore } from "./types.ts";

export const useAuthStore = create(
  devtools(
    persist<IAuthStore>(
      (set) => ({
        accessToken: undefined,
        setAccessToken: (accessToken: string): void => set({ accessToken }),
        clear: (): void => set({ accessToken: undefined }),
      }),
      {
        name: "auth-store",
        storage: createJSONStorage(() => localStorage),
      },
    ),
  ),
);
