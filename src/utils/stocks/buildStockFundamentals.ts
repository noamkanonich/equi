import type {
  FundamentalAiRead,
  FundamentalTrendMetricKind,
  FundamentalTrendStatus,
  StockFundamentalsData,
} from "@/data/stocks/stock-analysis.types";

const TREND_YEARS = ["2021", "2022", "2023", "2024", "TTM"] as const;

const METRIC_CONFIG: {
  kind: FundamentalTrendMetricKind;
  unitKey: "billions" | "perShare" | "percent";
  chartType: "bar" | "line";
  insightKey: string;
  baseValues: number[];
}[] = [
  {
    kind: "revenue",
    unitKey: "billions",
    chartType: "bar",
    insightKey: "fundamentals.insights.revenue",
    baseValues: [12, 15, 18, 22, 28],
  },
  {
    kind: "grossProfit",
    unitKey: "billions",
    chartType: "bar",
    insightKey: "fundamentals.insights.grossProfit",
    baseValues: [7, 9, 11, 14, 18],
  },
  {
    kind: "operatingIncome",
    unitKey: "billions",
    chartType: "bar",
    insightKey: "fundamentals.insights.operatingIncome",
    baseValues: [3, 4, 5.5, 7, 9],
  },
  {
    kind: "epsDiluted",
    unitKey: "perShare",
    chartType: "line",
    insightKey: "fundamentals.insights.epsDiluted",
    baseValues: [1.2, 1.6, 2.1, 2.8, 3.5],
  },
  {
    kind: "freeCashFlow",
    unitKey: "billions",
    chartType: "bar",
    insightKey: "fundamentals.insights.freeCashFlow",
    baseValues: [2.5, 3.2, 4.1, 5.5, 7],
  },
  {
    kind: "operatingMargin",
    unitKey: "percent",
    chartType: "line",
    insightKey: "fundamentals.insights.operatingMargin",
    baseValues: [18, 20, 22, 24, 26],
  },
];

const hashSymbolScale = (symbol: string): number => {
  const normalized = symbol.toUpperCase();
  let hash = 0;
  for (let index = 0; index < normalized.length; index += 1) {
    hash = (hash + normalized.charCodeAt(index) * (index + 1)) % 97;
  }
  return 0.72 + (hash % 28) / 100;
};

export type BuildDefaultFundamentalsInput = {
  symbol: string;
  scale?: number;
  status?: FundamentalTrendStatus;
  aiFundamentalRead?: FundamentalAiRead;
};

export const buildDefaultFundamentals = ({
  symbol,
  scale: scaleOverride,
  status = "improving",
  aiFundamentalRead,
}: BuildDefaultFundamentalsInput): StockFundamentalsData => {
  const symbolLower = symbol.toLowerCase();
  const scale = scaleOverride ?? hashSymbolScale(symbol);

  const read: FundamentalAiRead = aiFundamentalRead ?? {
    whatsStrongKey: `mock.${symbolLower}.fundamentals.whatsStrong`,
    riskToWatchKey: `mock.${symbolLower}.fundamentals.riskToWatch`,
    whatToMonitorKey: `mock.${symbolLower}.fundamentals.whatToMonitor`,
  };

  const peValue = (22 + hashSymbolScale(symbol) * 18).toFixed(1);
  const forwardPe = (18 + hashSymbolScale(symbol) * 12).toFixed(1);
  const peg = (1.1 + hashSymbolScale(symbol) * 0.8).toFixed(2);
  const grossMargin = (35 + hashSymbolScale(symbol) * 25).toFixed(2);
  const debtEquity = (0.15 + hashSymbolScale(symbol) * 0.6).toFixed(2);
  const roe = (12 + hashSymbolScale(symbol) * 35).toFixed(2);

  return {
    aiFundamentalRead: read,
    trendMetrics: METRIC_CONFIG.map((config) => ({
      kind: config.kind,
      unitKey: config.unitKey,
      status,
      chartType: config.chartType,
      insightKey: config.insightKey,
      data: TREND_YEARS.map((year, index) => ({
        year,
        value: Number((config.baseValues[index] * scale).toFixed(2)),
      })),
    })),
    valuationSnapshot: [
      { labelKey: "fundamentals.valuation.peTtm", value: peValue, status: "high" as const },
      { labelKey: "fundamentals.valuation.forwardPe", value: forwardPe, status: "moderate" as const },
      { labelKey: "fundamentals.valuation.peg5y", value: peg, status: "moderate" as const },
      {
        labelKey: "fundamentals.valuation.grossMarginTtm",
        value: `${grossMargin}%`,
        status: "strong" as const,
      },
      { labelKey: "fundamentals.valuation.debtEquity", value: debtEquity, status: "low" as const },
      { labelKey: "fundamentals.valuation.roeTtm", value: `${roe}%`, status: "strong" as const },
    ],
  };
};
