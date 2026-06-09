import { create } from "zustand";
import type { AppLocale } from "@/config/app.config";
import {
  DEFAULT_CURRENCY,
  mockFxRates,
  mockFxRatesMeta,
} from "@/data/currencies/currency.mock";
import type {
  CurrencyCode,
  FxRates,
  FxRatesMeta,
} from "@/data/currencies/currency.types";

interface AppState {
  locale: AppLocale;
  setLocale: (locale: AppLocale) => void;
  displayCurrency: CurrencyCode;
  setDisplayCurrency: (currency: CurrencyCode) => void;
  fxRates: FxRates;
  fxRatesMeta: FxRatesMeta;
  isLoadingFxRates: boolean;
  setFxRates: (rates: FxRates, meta: FxRatesMeta) => void;
  setIsLoadingFxRates: (loading: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  locale: "en",
  setLocale: (locale) => set({ locale }),
  displayCurrency: DEFAULT_CURRENCY,
  setDisplayCurrency: (displayCurrency) => set({ displayCurrency }),
  fxRates: mockFxRates,
  fxRatesMeta: mockFxRatesMeta,
  isLoadingFxRates: false,
  setFxRates: (fxRates, fxRatesMeta) => set({ fxRates, fxRatesMeta }),
  setIsLoadingFxRates: (isLoadingFxRates) => set({ isLoadingFxRates }),
}));
