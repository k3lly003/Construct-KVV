import { create } from "zustand";
import { persist } from "zustand/middleware";

interface GlobalState {
  isSidebarCollapsed: boolean;
  setIsSidebarCollapsed: (collapsed: boolean) => void;
  toggleSidebar: () => void;
}

export const useGlobalStore = create<GlobalState>()(
  persist(
    (set, get) => ({
      isSidebarCollapsed: false,
      setIsSidebarCollapsed: (collapsed: boolean) => {
        set({ isSidebarCollapsed: collapsed });
      },
      toggleSidebar: () => {
        set({ isSidebarCollapsed: !get().isSidebarCollapsed });
      },
    }),
    {
      name: "global-store", // localStorage key
      partialize: (state) => ({ isSidebarCollapsed: state.isSidebarCollapsed }),
    }
  )
);