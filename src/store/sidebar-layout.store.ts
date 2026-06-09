import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  clampSidebarWidth,
  getSidebarWidthBoundsPx,
} from "@/utils/layout/sidebarWidth";

type SidebarLayoutState = {
  widthPx: number;
  setWidthPx: (widthPx: number) => void;
  resetWidthPx: () => void;
};

const { defaultPx, minPx, maxPx } = getSidebarWidthBoundsPx();

const clampToBounds = (widthPx: number) =>
  clampSidebarWidth(widthPx, minPx, maxPx);

export const useSidebarLayoutStore = create<SidebarLayoutState>()(
  persist(
    (set) => ({
      widthPx: defaultPx,
      setWidthPx: (widthPx) => set({ widthPx: clampToBounds(widthPx) }),
      resetWidthPx: () => set({ widthPx: defaultPx }),
    }),
    {
      name: "equi-sidebar-layout",
      partialize: (state) => ({ widthPx: state.widthPx }),
      onRehydrateStorage: () => (state) => {
        if (!state) {
          return;
        }
        state.widthPx = clampToBounds(state.widthPx);
      },
    },
  ),
);

export const getSidebarLayoutBounds = () => ({
  defaultPx,
  minPx,
  maxPx,
});
