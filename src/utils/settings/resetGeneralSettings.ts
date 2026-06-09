import type { CurrencyCode } from "@/data/currencies/currency.types";
import type { SupportedLocale } from "@/data/i18n/i18n.types";
import { defaultGeneralSettings } from "@/data/settings/settings.mock";
import type { GeneralSettingsState } from "@/data/settings/settings.types";
import { useGeneralSettingsStore } from "@/store/general-settings.store";

export const resetGeneralSettings = (
  locale?: SupportedLocale,
  displayCurrency?: CurrencyCode,
): GeneralSettingsState => {
  useGeneralSettingsStore.getState().resetGeneralSettings();

  return {
    ...defaultGeneralSettings,
    ...(locale ? { language: locale } : {}),
    ...(displayCurrency ? { displayCurrency } : {}),
  };
};
