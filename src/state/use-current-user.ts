import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type CurrentUserState = {
  currentUserId: string;
  setCurrentUserId: (projectId: string) => void;
  clear: () => void;
};

export const useCurrentProject = create<CurrentUserState>()(
  persist(
    (set) => ({
      currentUserId: "abc123",
      setCurrentUserId: (projectId: string) =>
        set({ currentUserId: projectId }),
      clear: () => set({ currentUserId: "abc123" }),
    }),
    {
      name: "currentUserStorage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
