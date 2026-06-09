import type { CurrencyCode } from "@/data/currencies/currency.types";
import type { SupportedLocale } from "@/data/i18n/i18n.types";
import { normalizeAiPreferencesState } from "@/data/settings/mappers";
import { defaultGeneralSettings } from "@/data/settings/settings.mock";
import type {
  AiPreferencesState,
  AlertSettingsState,
  AppearanceSettingsState,
  GeneralSettingsState,
  PortfolioSettingsState,
  ScoringModelSettingsState,
} from "@/data/settings/settings.types";
import { useAiPreferencesStore } from "@/store/ai-preferences.store";
import { useAlertSettingsStore } from "@/store/alert-settings.store";
import { useAppearanceStore } from "@/store/appearance.store";
import { useGeneralSettingsStore } from "@/store/general-settings.store";
import { usePortfolioSettingsStore } from "@/store/portfolio-settings.store";
import { useScoringSettingsStore } from "@/store/scoring-settings.store";

export const buildGeneralSettingsFromStore = (
  locale: SupportedLocale,
  displayCurrency: CurrencyCode,
): GeneralSettingsState => {
  const persisted = useGeneralSettingsStore.getState().generalSettings;

  return {
    ...defaultGeneralSettings,
    ...persisted,
    language: locale,
    displayCurrency,
  };
};

export const buildAppearanceSettingsFromStore = (): AppearanceSettingsState => {
  return useAppearanceStore.getState().appearanceSettings;
};

export const buildPortfolioSettingsFromStore = (): PortfolioSettingsState => {
  return usePortfolioSettingsStore.getState().portfolioSettings;
};

export const buildScoringModelSettingsFromStore = (): ScoringModelSettingsState => {
  return useScoringSettingsStore.getState().scoringModelSettings;
};

export const buildAlertSettingsFromStore = (): AlertSettingsState => {
  return useAlertSettingsStore.getState().alertSettings;
};

export const buildAiPreferencesFromStore = (): AiPreferencesState => {
  return normalizeAiPreferencesState(
    useAiPreferencesStore.getState().aiPreferences as AiPreferencesState &
      Record<string, unknown>,
  );
};
