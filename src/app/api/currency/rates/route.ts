import { NextResponse } from "next/server";
import {
  mockFxRates,
  mockFxRatesMeta,
} from "@/data/currencies/currency.mock";
import type { CurrencyRatesResponse } from "@/data/currencies/currency.types";
import { fetchFrankfurterLatestRates } from "@/lib/financial-data/currency-api.client";

export const GET = async () => {
  try {
    const result = await fetchFrankfurterLatestRates();
    return NextResponse.json(result);
  } catch (error) {
    console.error("[currency/rates] Frankfurter fetch failed:", error);

    const fallback: CurrencyRatesResponse = {
      rates: mockFxRates,
      meta: {
        ...mockFxRatesMeta,
        lastUpdated: new Date().toISOString(),
      },
    };

    return NextResponse.json(fallback);
  }
};
