import { NextResponse } from "next/server";
import { buildMockStockDataBundle } from "@/data/financial-data/financial-data.mock";
import { normalizeProviderSymbol } from "@/data/financial-data/mappers";
import type { StockDataBundleResponse } from "@/data/financial-data/financial-data.types";
import { logFinancialDataDebug } from "@/lib/financial-data/devFinancialDataLog";
import { getStockDataBundle } from "@/utils/financial-data/getStockDataBundle";
import {
  stockBundleScopeSchema,
  stockBundleSectionsQuerySchema,
  stockSymbolParamSchema,
} from "@/utils/financial-data/stock-bundle.schema";

type RouteContext = {
  params: Promise<{ symbol: string }>;
};

export const GET = async (request: Request, context: RouteContext) => {
  const { symbol: rawSymbol } = await context.params;
  const parsed = stockSymbolParamSchema.safeParse(rawSymbol);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid stock symbol" },
      { status: 400 },
    );
  }

  const { searchParams } = new URL(request.url);
  const scopeResult = stockBundleScopeSchema.safeParse(
    searchParams.get("scope") ?? "display",
  );

  if (!scopeResult.success) {
    return NextResponse.json(
      { error: "Invalid scope parameter" },
      { status: 400 },
    );
  }

  const sectionsResult = stockBundleSectionsQuerySchema.safeParse(
    searchParams.get("sections") ?? undefined,
  );

  if (!sectionsResult.success) {
    return NextResponse.json(
      { error: "Invalid sections parameter" },
      { status: 400 },
    );
  }

  const symbol = normalizeProviderSymbol(parsed.data);

  try {
    const bundle = await getStockDataBundle(symbol, {
      scope: scopeResult.data,
      sections: sectionsResult.data,
    });
    logFinancialDataDebug("api.stocks.response", {
      symbol,
      provider: bundle.meta.provider,
      isFallback: bundle.meta.isFallback,
      source: bundle.meta.source,
      quotePrice: bundle.quote?.price,
    });
    const response: StockDataBundleResponse = { bundle };
    return NextResponse.json(response);
  } catch (error) {
    console.error(`[api/stocks/${symbol}] fetch failed:`, error);
    const fallback = buildMockStockDataBundle(symbol);
    const response: StockDataBundleResponse = { bundle: fallback };
    return NextResponse.json(response);
  }
};
