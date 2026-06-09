import type { FinancialDataSection } from "@/data/financial-data/financial-data.types";
import type { StockDataScope } from "@/data/app-data/app-data.types";

/** Client TTLs aligned with server `stock-data-cache.ts`. */
export const CLIENT_SECTION_TTL_MS: Record<FinancialDataSection, number> = {
  quote: 5 * 60 * 1000,
  profile: 24 * 60 * 60 * 1000,
  keyMetrics: 24 * 60 * 60 * 1000,
  incomeStatements: 24 * 60 * 60 * 1000,
  cashFlowStatements: 24 * 60 * 60 * 1000,
  priceHistory: 15 * 60 * 1000,
  intraday: 15 * 60 * 1000,
  news: 60 * 60 * 1000,
  earnings: 6 * 60 * 60 * 1000,
  analystTarget: 6 * 60 * 60 * 1000,
  analystRatings: 6 * 60 * 60 * 1000,
};

const DISPLAY_SECTIONS: FinancialDataSection[] = ["profile", "quote"];

const FULL_SECTIONS: FinancialDataSection[] = [
  "profile",
  "quote",
  "keyMetrics",
  "incomeStatements",
  "cashFlowStatements",
  "priceHistory",
  "intraday",
  "news",
  "earnings",
  "analystTarget",
];

export const resolveClientRequestedSections = (input: {
  scope?: StockDataScope;
  sections?: FinancialDataSection[];
}): FinancialDataSection[] => {
  if (input.sections && input.sections.length > 0) {
    return [...new Set(input.sections)];
  }

  return input.scope === "full" ? FULL_SECTIONS : DISPLAY_SECTIONS;
};
