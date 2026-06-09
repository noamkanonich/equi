import type { CurrencyCode } from "@/data/currencies/currency.types";
import type { SupportedLocale } from "@/data/i18n/i18n.types";
import type { GeneralSettingsState } from "@/data/settings/settings.types";
import { useGeneralSettingsStore } from "@/store/general-settings.store";

type ApplyGeneralSettingsParams = {
  draft: GeneralSettingsState;
  currentLocale: SupportedLocale;
  currentCurrency: CurrencyCode;
  setDisplayCurrency: (currency: CurrencyCode) => void;
  switchLocale: (locale: SupportedLocale) => void;
};

export const applyGeneralSettings = ({
  draft,
  currentLocale,
  currentCurrency,
  setDisplayCurrency,
  switchLocale,
}: ApplyGeneralSettingsParams): GeneralSettingsState => {
  if (draft.language !== currentLocale) {
    switchLocale(draft.language);
  }

  if (draft.displayCurrency !== currentCurrency) {
    setDisplayCurrency(draft.displayCurrency);
  }

  useGeneralSettingsStore.getState().setGeneralSettings({
    marketRegion: draft.marketRegion,
    dateFormat: draft.dateFormat,
    benchmark: draft.benchmark,
  });

  return { ...draft };
};
