import { create } from "zustand";
import { persist } from "zustand/middleware";
import { defaultPortfolioSettings } from "@/data/settings/settings.mock";
import type { PortfolioSettingsState } from "@/data/settings/settings.types";

type PortfolioSettingsStoreState = {
  portfolioSettings: PortfolioSettingsState;
  setPortfolioSettings: (settings: PortfolioSettingsState) => void;
  resetPortfolioSettings: () => void;
};

export const usePortfolioSettingsStore = create<PortfolioSettingsStoreState>()(
  persist(
    (set) => ({
      portfolioSettings: defaultPortfolioSettings,
      setPortfolioSettings: (portfolioSettings) => set({ portfolioSettings }),
      resetPortfolioSettings: () =>
        set({ portfolioSettings: { ...defaultPortfolioSettings } }),
    }),
    {
      name: "equi-portfolio-settings",
      partialize: (state) => ({
        portfolioSettings: state.portfolioSettings,
      }),
    },
  ),
);
