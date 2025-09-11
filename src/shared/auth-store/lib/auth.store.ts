import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";

import { IAuthStore } from "./types.ts";

export const useAuthStore = create(
  devtools(
    persist<IAuthStore>(
      (set) => ({
        accessToken: undefined,
        setAccessToken: (accessToken: string): unknown => set({ accessToken }),
        clear: (): unknown => set({ accessToken: undefined }),
      }),
      {
        name: "auth-store",
        storage: createJSONStorage(() => localStorage),
      },
    ),
  ),
);
