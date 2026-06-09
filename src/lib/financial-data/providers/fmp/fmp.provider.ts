import type { StockDataProvider } from "@/lib/financial-data/providers/types";
import { fetchFmp } from "./fmp.client";
import { fmpEndpoints } from "./fmp.endpoints";
import {
  isFmpArrayResponse,
  isFmpObjectResponse,
} from "./fmpResponseGuards";
import { format } from "date-fns";
import {
  mapFmpAnalystTargetToStockProvider,
  mapFmpCashFlowToStockProvider,
  mapFmpEarningsToStockProvider,
  mapFmpHistoricalPriceToStockProvider,
  mapFmpIncomeStatementToStockProvider,
  mapFmpIntradayBarsToHistory,
  mapFmpKeyMetricsToStockProviderKeyMetrics,
  mapFmpNewsToStockProviderNews,
  mapFmpProfileToStockProviderProfile,
  mapFmpQuoteToStockProviderQuote,
  mapFmpStableHistoricalPricesToStockProvider,
} from "./mappers";
import type {
  FmpCashFlowStatement,
  FmpEarningCalendar,
  FmpGradesConsensus,
  FmpHistoricalPriceFull,
  FmpHistoricalPricePoint,
  FmpIncomeStatement,
  FmpIntradayBar,
  FmpKeyMetrics,
  FmpPriceTargetConsensus,
  FmpPriceTargetSummary,
  FmpProfile,
  FmpQuote,
  FmpStockNews,
} from "./fmp.types";

const firstOrNull = <T>(items: T[] | null | undefined): T | null =>
  items && items.length > 0 ? items[0] : null;

export const fmpStockProvider: StockDataProvider = {
  id: "fmp",

  fetchProfile: async (symbol) => {
    const data = await fetchFmp<unknown>(fmpEndpoints.profile(symbol));
    if (!isFmpArrayResponse<FmpProfile>(data)) {
      return null;
    }
    const raw = firstOrNull(data);
    return raw ? mapFmpProfileToStockProviderProfile(raw) : null;
  },

  fetchQuote: async (symbol) => {
    const data = await fetchFmp<unknown>(fmpEndpoints.quote(symbol));
    if (!isFmpArrayResponse<FmpQuote>(data)) {
      return null;
    }
    const raw = firstOrNull(data);
    return raw ? mapFmpQuoteToStockProviderQuote(raw) : null;
  },

  fetchKeyMetrics: async (symbol) => {
    const data = await fetchFmp<unknown>(fmpEndpoints.keyMetrics(symbol));
    if (!isFmpArrayResponse<FmpKeyMetrics>(data)) {
      return null;
    }
    const raw = firstOrNull(data);
    return raw ? mapFmpKeyMetricsToStockProviderKeyMetrics(raw) : null;
  },

  fetchIncomeStatements: async (symbol) => {
    const data = await fetchFmp<unknown>(fmpEndpoints.incomeStatement(symbol));
    if (!isFmpArrayResponse<FmpIncomeStatement>(data)) {
      return [];
    }
    return data.map(mapFmpIncomeStatementToStockProvider);
  },

  fetchCashFlowStatements: async (symbol) => {
    const data = await fetchFmp<unknown>(fmpEndpoints.cashFlowStatement(symbol));
    if (!isFmpArrayResponse<FmpCashFlowStatement>(data)) {
      return [];
    }
    return data.map(mapFmpCashFlowToStockProvider);
  },

  fetchIntradayHistory: async (symbol) => {
    const today = format(new Date(), "yyyy-MM-dd");
    const data = await fetchFmp<unknown>(
      fmpEndpoints.historicalChart5Min(symbol, today, today),
    );
    if (!isFmpArrayResponse<FmpIntradayBar>(data)) {
      return null;
    }
    return mapFmpIntradayBarsToHistory(symbol, data);
  },

  fetchPriceHistory: async (symbol) => {
    const data = await fetchFmp<unknown>(fmpEndpoints.historicalPriceFull(symbol));

    if (isFmpArrayResponse<FmpHistoricalPricePoint>(data)) {
      const mapped = mapFmpStableHistoricalPricesToStockProvider(symbol, data);
      return mapped.points.length > 0 ? mapped : null;
    }

    if (isFmpObjectResponse(data) && Array.isArray(data.historical)) {
      const history = data as FmpHistoricalPriceFull;
      if (!history.historical?.length) {
        return null;
      }
      const mapped = mapFmpHistoricalPriceToStockProvider(history);
      return mapped.points.length > 0 ? mapped : null;
    }

    return null;
  },

  fetchNews: async (symbol) => {
    const data = await fetchFmp<unknown>(fmpEndpoints.stockNews(symbol));
    if (!isFmpArrayResponse<FmpStockNews>(data)) {
      return [];
    }
    return mapFmpNewsToStockProviderNews(data);
  },

  fetchEarnings: async (symbol, context) => {
    const profile =
      context?.profile ?? (await fmpStockProvider.fetchProfile(symbol));
    const data = await fetchFmp<unknown>(fmpEndpoints.earningCalendar(symbol));
    if (!isFmpArrayResponse<FmpEarningCalendar>(data)) {
      return [];
    }
    const upcoming = data.filter(
      (item) => new Date(item.date) >= new Date(new Date().toISOString().slice(0, 10)),
    );
    return mapFmpEarningsToStockProvider(
      upcoming.slice(0, 5),
      profile?.companyName ?? symbol,
    );
  },

  fetchAnalystTarget: async (symbol, context) => {
    const quote = context?.quote ?? (await fmpStockProvider.fetchQuote(symbol));
    if (!quote) {
      return null;
    }

    const [summaryData, consensusData, gradesData] = await Promise.all([
      fetchFmp<unknown>(fmpEndpoints.priceTargetSummary(symbol)).catch(() => null),
      fetchFmp<unknown>(fmpEndpoints.priceTargetConsensus(symbol)).catch(() => null),
      fetchFmp<unknown>(fmpEndpoints.gradesConsensus(symbol)).catch(() => null),
    ]);

    const summary = isFmpArrayResponse<FmpPriceTargetSummary>(summaryData)
      ? firstOrNull(summaryData)
      : isFmpObjectResponse(summaryData)
        ? (summaryData as FmpPriceTargetSummary)
        : null;

    const consensus = isFmpArrayResponse<FmpPriceTargetConsensus>(consensusData)
      ? firstOrNull(consensusData)
      : isFmpObjectResponse(consensusData)
        ? (consensusData as FmpPriceTargetConsensus)
        : null;

    const grades = isFmpArrayResponse<FmpGradesConsensus>(gradesData)
      ? firstOrNull(gradesData)
      : isFmpObjectResponse(gradesData)
        ? (gradesData as FmpGradesConsensus)
        : null;

    return mapFmpAnalystTargetToStockProvider({
      symbol,
      currentPrice: quote.price,
      summary,
      consensus,
      grades,
    });
  },
};
