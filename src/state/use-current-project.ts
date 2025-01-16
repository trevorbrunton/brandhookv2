import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type CurrentProjectIdState = {
  currentProjectId: string;
  setCurrentProjectId: (projectId: string) => void;
  clear: () => void;
};

export const useCurrentProject = create<CurrentProjectIdState>()(
  persist(
    (set) => ({
      currentProjectId: "",
      setCurrentProjectId: (projectId: string) =>
        set({ currentProjectId: projectId }),
      clear: () => set({ currentProjectId: "" }),
    }),
    {
      name: "currentProjectStorage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
