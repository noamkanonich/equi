import { create } from "zustand";
import { persist } from "zustand/middleware";
import { normalizeAiPreferencesState } from "@/data/settings/mappers";
import { defaultAiPreferences } from "@/data/settings/settings.mock";
import type { AiPreferencesState } from "@/data/settings/settings.types";

type AiPreferencesStoreState = {
  aiPreferences: AiPreferencesState;
  setAiPreferences: (settings: AiPreferencesState) => void;
  resetAiPreferences: () => void;
};

export const useAiPreferencesStore = create<AiPreferencesStoreState>()(
  persist(
    (set) => ({
      aiPreferences: defaultAiPreferences,
      setAiPreferences: (aiPreferences) => set({ aiPreferences }),
      resetAiPreferences: () => set({ aiPreferences: { ...defaultAiPreferences } }),
    }),
    {
      name: "equi-ai-preferences",
      partialize: (state) => ({
        aiPreferences: state.aiPreferences,
      }),
      merge: (persisted, current) => {
        const persistedState = persisted as AiPreferencesStoreState | undefined;
        if (!persistedState?.aiPreferences) {
          return current;
        }

        return {
          ...current,
          aiPreferences: normalizeAiPreferencesState(
            persistedState.aiPreferences as AiPreferencesState & Record<string, unknown>,
          ),
        };
      },
    },
  ),
);
