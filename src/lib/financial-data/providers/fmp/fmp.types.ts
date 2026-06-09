export type FmpProfile = {
  symbol: string;
  companyName: string;
  description?: string;
  exchangeShortName?: string;
  exchange?: string;
  sector?: string;
  industry?: string;
  country?: string;
  website?: string;
  image?: string;
  currency?: string;
  mktCap?: number;
  beta?: number;
  ceo?: string;
  fullTimeEmployees?: number;
  ipoDate?: string;
};

export type FmpQuote = {
  symbol: string;
  name?: string;
  price: number;
  changesPercentage?: number;
  change?: number;
  previousClose?: number;
  dayHigh?: number;
  dayLow?: number;
  volume?: number;
  marketCap?: number;
  timestamp?: number;
  exchange?: string;
};

export type FmpKeyMetrics = {
  symbol: string;
  date?: string;
  peRatio?: number;
  pegRatio?: number;
  priceToSalesRatio?: number;
  enterpriseValue?: number;
  marketCap?: number;
  revenuePerShare?: number;
  netIncomePerShare?: number;
  operatingCashFlowPerShare?: number;
  freeCashFlowPerShare?: number;
  roe?: number;
  roa?: number;
  debtToEquity?: number;
  currentRatio?: number;
  grossProfitMargin?: number;
  operatingProfitMargin?: number;
  netProfitMargin?: number;
  revenueGrowth?: number;
  epsgrowth?: number;
};

export type FmpIncomeStatement = {
  symbol: string;
  date: string;
  calendarYear?: string;
  period?: string;
  revenue?: number;
  grossProfit?: number;
  operatingIncome?: number;
  netIncome?: number;
  eps?: number;
  epsdiluted?: number;
  reportedCurrency?: string;
};

export type FmpCashFlowStatement = {
  symbol: string;
  date: string;
  calendarYear?: string;
  period?: string;
  operatingCashFlow?: number;
  freeCashFlow?: number;
  reportedCurrency?: string;
};

export type FmpHistoricalPricePoint = {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
};

export type FmpHistoricalPriceFull = {
  symbol: string;
  historical: FmpHistoricalPricePoint[];
};

export type FmpStockNews = {
  symbol: string;
  publishedDate: string;
  title: string;
  text?: string;
  site: string;
  url: string;
  image?: string;
};

export type FmpEarningCalendar = {
  symbol: string;
  date: string;
  epsEstimated?: number;
  revenueEstimated?: number;
  time?: string;
};

export type FmpPriceTargetSummary = {
  symbol: string;
  lastMonth?: number;
  lastMonthAvgPriceTarget?: number;
  lastQuarter?: number;
  lastQuarterAvgPriceTarget?: number;
  lastYear?: number;
  lastYearAvgPriceTarget?: number;
  allTime?: number;
  allTimeAvgPriceTarget?: number;
  publishers?: string;
};

export type FmpPriceTargetConsensus = {
  symbol: string;
  targetHigh?: number;
  targetLow?: number;
  targetConsensus?: number;
  targetMedian?: number;
};

export type FmpGradesConsensus = {
  symbol: string;
  strongBuy?: number;
  buy?: number;
  hold?: number;
  sell?: number;
  strongSell?: number;
  consensus?: string;
};

export type FmpIntradayBar = {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume?: number;
};
