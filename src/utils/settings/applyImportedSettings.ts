import type { CurrencyCode } from "@/data/currencies/currency.types";
import type { SupportedLocale } from "@/data/i18n/i18n.types";
import type {
  AppliedSettingsSnapshot,
  EquiSettingsExportPayload,
} from "@/data/settings/settings.types";
import { applyAiPreferencesSettings } from "@/utils/settings/applyAiPreferencesSettings";
import { applyAlertSettings } from "@/utils/settings/applyAlertSettings";
import { applyGeneralSettings } from "@/utils/settings/applyGeneralSettings";
import { applyPortfolioSettings } from "@/utils/settings/applyPortfolioSettings";
import { applyScoringModelSettings } from "@/utils/settings/applyScoringModelSettings";
import { applyAppearanceSettings } from "@/utils/settings/resetAppearanceSettings";

type ApplyImportedSettingsParams = {
  payload: EquiSettingsExportPayload;
  currentLocale: SupportedLocale;
  currentCurrency: CurrencyCode;
  setDisplayCurrency: (currency: CurrencyCode) => void;
  switchLocale: (locale: SupportedLocale) => void;
};

export const applyImportedSettings = ({
  payload,
  currentLocale,
  currentCurrency,
  setDisplayCurrency,
  switchLocale,
}: ApplyImportedSettingsParams): AppliedSettingsSnapshot => {
  const general = applyGeneralSettings({
    draft: payload.general,
    currentLocale,
    currentCurrency,
    setDisplayCurrency,
    switchLocale,
  });

  const appearance = applyAppearanceSettings(payload.appearance);
  const portfolio = applyPortfolioSettings(payload.portfolio);
  const scoringModel = applyScoringModelSettings(payload.scoringModel);
  const alerts = applyAlertSettings(payload.alerts);
  const aiPreferences = applyAiPreferencesSettings(payload.aiPreferences);

  return {
    general,
    appearance,
    portfolio,
    scoringModel,
    alerts,
    aiPreferences,
  };
};
