import { z } from "zod";
import type { FinancialDataSection } from "@/data/financial-data/financial-data.types";

export const STOCK_BUNDLES_MAX_SYMBOLS = 30;

const financialDataSectionSchema = z.enum([
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
  "analystRatings",
]) satisfies z.ZodType<FinancialDataSection>;

export const stockBundleScopeSchema = z.enum(["display", "full"]);

export const stockBundleSectionsQuerySchema = z.preprocess(
  (value) => (value === null || value === "" ? undefined : value),
  z
    .string()
    .trim()
    .transform((raw) => {
      const sections = raw
        .split(",")
        .map((part) => part.trim())
        .filter(Boolean);

      return [...new Set(sections)];
    })
    .pipe(z.array(financialDataSectionSchema))
    .optional(),
);

export const stockSymbolParamSchema = z
  .string()
  .trim()
  .toUpperCase()
  .regex(/^[A-Z0-9.]{1,12}$/, "Invalid stock symbol");

export const stockBundlesQuerySchema = z
  .string()
  .trim()
  .min(1, "symbols query is required")
  .transform((raw) => {
    const seen = new Set<string>();
    const symbols: string[] = [];

    for (const part of raw.split(",")) {
      const normalized = part.trim().toUpperCase();
      if (!normalized || seen.has(normalized)) {
        continue;
      }
      seen.add(normalized);
      symbols.push(normalized);
    }

    return symbols;
  })
  .pipe(
    z
      .array(stockSymbolParamSchema)
      .min(1, "At least one symbol is required")
      .max(
        STOCK_BUNDLES_MAX_SYMBOLS,
        `Maximum ${STOCK_BUNDLES_MAX_SYMBOLS} symbols allowed`,
      ),
  );
