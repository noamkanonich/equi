import { supportedCurrencies } from "./currency.mock";
import type { CurrencyCode, CurrencyInfo, FxRates } from "./currency.types";

const SUPPORTED_CODES: CurrencyCode[] = ["USD", "ILS", "EUR"];

export const getCurrencyOptions = (): CurrencyInfo[] => supportedCurrencies;

export const getCurrencyByCode = (
  code: CurrencyCode,
): CurrencyInfo | undefined => {
  return supportedCurrencies.find((currency) => currency.code === code);
};

export const mapCurrencyCodeToTranslationKey = (
  code: CurrencyCode,
): "usd" | "ils" | "eur" => {
  return code.toLowerCase() as "usd" | "ils" | "eur";
};

export const buildFxRatesMatrix = (
  usdRates: Record<string, number>,
): FxRates => {
  const usdToCurrency: Record<CurrencyCode, number> = {
    USD: 1,
    ILS: usdRates.ILS ?? 1,
    EUR: usdRates.EUR ?? 1,
  };

  const matrix = {} as FxRates;

  for (const from of SUPPORTED_CODES) {
    matrix[from] = {} as Record<CurrencyCode, number>;

    for (const to of SUPPORTED_CODES) {
      matrix[from][to] = usdToCurrency[to] / usdToCurrency[from];
    }
  }

  return matrix;
};
