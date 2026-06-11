import { differenceInDays, parseISO } from "date-fns";
import type { CurrencyCode } from "@/data/currencies/currency.types";
import {
  reportsMockTaxLots,
  reportsMockTaxSummary,
} from "@/data/reports/reports.mock";
import type { TaxLotItem, TaxSummaryItem } from "@/data/reports/reports.types";
import type { EnrichedPortfolioHolding } from "@/data/portfolio/portfolio.types";

const LONG_TERM_DAYS = 365;

const mapGainLossTone = (
  gainLoss: number,
): "positive" | "negative" | "neutral" => {
  if (gainLoss > 0) return "positive";
  if (gainLoss < 0) return "negative";
  return "neutral";
};

const getHoldingPeriod = (acquiredDate: string): "short" | "long" => {
  const daysHeld = differenceInDays(new Date(), parseISO(acquiredDate));
  return daysHeld > LONG_TERM_DAYS ? "long" : "short";
};

const buildTaxLotsFromHoldings = (
  holdings: EnrichedPortfolioHolding[],
  currency: CurrencyCode,
): TaxLotItem[] => {
  return holdings.map((holding) => {
    const acquiredDate = holding.purchaseDate ?? holding.createdAt;
    const gainLoss = holding.totalGainLoss;

    return {
      symbol: holding.symbol,
      companyName: holding.companyName,
      shares: holding.shares,
      costBasis: holding.totalCost,
      currentValue: holding.marketValue,
      gainLoss,
      gainLossPercent: holding.totalGainLossPercent,
      holdingPeriod: getHoldingPeriod(acquiredDate),
      acquiredDate,
      currency: holding.purchaseCurrency ?? currency,
      tone: mapGainLossTone(gainLoss),
    };
  });
};

const buildTaxSummaryFromLots = (
  lots: TaxLotItem[],
  currency: CurrencyCode,
): TaxSummaryItem[] => {
  const unrealizedGains = lots.reduce(
    (sum, lot) => sum + Math.max(0, lot.gainLoss),
    0,
  );

  const shortTermGains = lots
    .filter((lot) => lot.holdingPeriod === "short")
    .reduce((sum, lot) => sum + lot.gainLoss, 0);

  const longTermGains = lots
    .filter((lot) => lot.holdingPeriod === "long")
    .reduce((sum, lot) => sum + lot.gainLoss, 0);

  const mapMoneyTone = (value: number): "positive" | "negative" | "neutral" =>
    value > 0 ? "positive" : value < 0 ? "negative" : "neutral";

  return [
    {
      key: "realizedGains",
      value: 0,
      currency,
      kind: "money",
      tone: "neutral",
    },
    {
      key: "unrealizedGains",
      value: unrealizedGains,
      currency,
      kind: "money",
      tone: mapMoneyTone(unrealizedGains),
    },
    {
      key: "dividendIncome",
      value: 0,
      currency,
      kind: "money",
      tone: "neutral",
    },
    {
      key: "shortTermGains",
      value: shortTermGains,
      currency,
      kind: "money",
      tone: mapMoneyTone(shortTermGains),
    },
    {
      key: "longTermGains",
      value: longTermGains,
      currency,
      kind: "money",
      tone: mapMoneyTone(longTermGains),
    },
    {
      key: "estimatedTax",
      value: 0,
      currency,
      kind: "money",
      tone: "neutral",
    },
  ];
};

type BuildTaxDataResult = {
  taxSummary: TaxSummaryItem[];
  taxLots: TaxLotItem[];
};

export const buildTaxData = (
  holdings: EnrichedPortfolioHolding[],
  currency: CurrencyCode,
  hasHoldings: boolean,
  isUsingDemoPortfolio = false,
): BuildTaxDataResult => {
  if (!hasHoldings || holdings.length === 0) {
    if (isUsingDemoPortfolio) {
      return {
        taxSummary: reportsMockTaxSummary,
        taxLots: reportsMockTaxLots,
      };
    }

    return {
      taxSummary: buildTaxSummaryFromLots([], currency),
      taxLots: [],
    };
  }

  const taxLots = buildTaxLotsFromHoldings(holdings, currency);
  const taxSummary = buildTaxSummaryFromLots(taxLots, currency);

  return { taxSummary, taxLots };
};
