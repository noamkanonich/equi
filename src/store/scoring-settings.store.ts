import { create } from "zustand";
import { persist } from "zustand/middleware";
import { defaultScoringModelSettings } from "@/data/settings/settings.mock";
import type { ScoringModelSettingsState } from "@/data/settings/settings.types";

type ScoringSettingsStoreState = {
  scoringModelSettings: ScoringModelSettingsState;
  setScoringModelSettings: (settings: ScoringModelSettingsState) => void;
  resetScoringModelSettings: () => void;
};

export const useScoringSettingsStore = create<ScoringSettingsStoreState>()(
  persist(
    (set) => ({
      scoringModelSettings: defaultScoringModelSettings,
      setScoringModelSettings: (scoringModelSettings) => set({ scoringModelSettings }),
      resetScoringModelSettings: () =>
        set({ scoringModelSettings: { ...defaultScoringModelSettings } }),
    }),
    {
      name: "equi-scoring-settings",
      partialize: (state) => ({
        scoringModelSettings: state.scoringModelSettings,
      }),
    },
  ),
);
