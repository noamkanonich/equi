import type {
  WatchlistInsight,
  WatchlistMetric,
  WatchlistSidebarSummary,
  WatchlistStoredItem,
} from "./watchlist.types";
import { createWatchlistStoredItemSeed } from "./watchlist-seed";

const nvdaTrend = [
  78, 79, 76, 81, 83, 80, 82, 85, 84, 86, 85, 88, 87, 89, 88, 90,
];

const msftTrend = [
  68, 69, 71, 70, 72, 74, 73, 75, 76, 75, 77, 78, 79, 78, 80, 79,
];

const aaplTrend = [
  65, 66, 67, 68, 67, 69, 70, 69, 71, 72, 71, 73, 72, 74, 73, 72,
];

export const watchlistSummaryMetrics: WatchlistMetric[] = [
  {
    kind: "watchedStocks",
    value: 8,
    helperKey: "metrics.thisWeek",
    helperValue: "+2",
    trend: [5, 5, 6, 6, 6, 7, 8],
    tone: "positive",
  },
  {
    kind: "averageOpportunityScore",
    value: 72,
    helperKey: "metrics.vsLastWeek",
    helperValue: "+4.6%",
    trend: [61, 63, 64, 66, 65, 68, 70, 69, 72],
    tone: "positive",
  },
  {
    kind: "inBuyZone",
    value: 2,
    helperKey: "metrics.ofWatchlist",
    helperValue: "25%",
    trend: [1, 1, 2, 1, 2, 2, 2],
    tone: "positive",
  },
  {
    kind: "upcomingEarnings",
    value: 5,
    helperKey: "metrics.nextThirtyDays",
    trend: [3, 3, 4, 4, 5, 5, 5],
    tone: "neutral",
  },
  {
    kind: "alertsTriggered",
    value: 3,
    helperKey: "metrics.newToday",
    helperValue: "+1",
    trend: [0, 1, 1, 2, 2, 3, 3],
    tone: "negative",
  },
];

export const initialWatchlistItems: WatchlistStoredItem[] = [
  createWatchlistStoredItemSeed({
    id: "nvda",
    symbol: "NVDA",
    buyZone: { low: 88, high: 98, currency: "USD" },
    qualityScore: 93,
    opportunityScore: 88,
    status: "waitForPullback",
    trigger: {
      summaryKey: "rows.nvda.trigger",
      detailKey: "rows.nvda.expandedTrigger",
    },
    action: "reviewStock",
    isFavorite: true,
    whyWatchingKey: "rows.nvda.whyWatching",
    monitorKeys: [
      "rows.nvda.monitor.blackwell",
      "rows.nvda.monitor.margins",
      "rows.nvda.monitor.china",
    ],
    opportunityTrend: nvdaTrend.map((score, index) => ({
      date: `2026-05-${String(index + 1).padStart(2, "0")}`,
      score,
    })),
  }),
  createWatchlistStoredItemSeed({
    id: "msft",
    symbol: "MSFT",
    buyZone: { low: 380, high: 415, currency: "USD" },
    qualityScore: 89,
    opportunityScore: 79,
    status: "waitForPullback",
    trigger: { summaryKey: "rows.msft.trigger" },
    action: "reviewStock",
    isFavorite: false,
    whyWatchingKey: "rows.msft.whyWatching",
    monitorKeys: ["rows.msft.monitor.cloud", "rows.msft.monitor.ai"],
    opportunityTrend: msftTrend.map((score, index) => ({
      date: `2026-05-${String(index + 1).padStart(2, "0")}`,
      score,
    })),
  }),
  createWatchlistStoredItemSeed({
    id: "aapl",
    symbol: "AAPL",
    buyZone: { low: 175, high: 190, currency: "USD" },
    qualityScore: 85,
    opportunityScore: 72,
    status: "watchClosely",
    trigger: { summaryKey: "rows.aapl.trigger" },
    action: "setAlert",
    isFavorite: false,
    whyWatchingKey: "rows.aapl.whyWatching",
    monitorKeys: ["rows.aapl.monitor.services", "rows.aapl.monitor.iphone"],
    opportunityTrend: aaplTrend.map((score, index) => ({
      date: `2026-05-${String(index + 1).padStart(2, "0")}`,
      score,
    })),
  }),
  createWatchlistStoredItemSeed({
    id: "googl",
    symbol: "GOOGL",
    buyZone: { low: 150, high: 165, currency: "USD" },
    qualityScore: 82,
    opportunityScore: 68,
    status: "watchClosely",
    trigger: { summaryKey: "rows.googl.trigger" },
    action: "setAlert",
    isFavorite: false,
    whyWatchingKey: "rows.googl.whyWatching",
    monitorKeys: ["rows.googl.monitor.search", "rows.googl.monitor.cloud"],
    opportunityTrend: [61, 62, 64, 63, 65, 67, 66, 68].map((score, index) => ({
      date: `2026-05-${String(index + 1).padStart(2, "0")}`,
      score,
    })),
  }),
  createWatchlistStoredItemSeed({
    id: "amzn",
    symbol: "AMZN",
    buyZone: { low: 160, high: 175, currency: "USD" },
    qualityScore: 80,
    opportunityScore: 66,
    status: "watchClosely",
    trigger: { summaryKey: "rows.amzn.trigger" },
    action: "compare",
    isFavorite: false,
    whyWatchingKey: "rows.amzn.whyWatching",
    monitorKeys: ["rows.amzn.monitor.aws", "rows.amzn.monitor.retail"],
    opportunityTrend: [58, 60, 61, 63, 62, 65, 64, 66].map((score, index) => ({
      date: `2026-05-${String(index + 1).padStart(2, "0")}`,
      score,
    })),
  }),
  createWatchlistStoredItemSeed({
    id: "tsla",
    symbol: "TSLA",
    buyZone: { low: 150, high: 170, currency: "USD" },
    qualityScore: 62,
    opportunityScore: 44,
    status: "tooExpensive",
    trigger: { summaryKey: "rows.tsla.trigger" },
    action: "setAlert",
    isFavorite: false,
    whyWatchingKey: "rows.tsla.whyWatching",
    monitorKeys: ["rows.tsla.monitor.margins", "rows.tsla.monitor.delivery"],
    opportunityTrend: [50, 48, 47, 45, 46, 44, 43, 44].map((score, index) => ({
      date: `2026-05-${String(index + 1).padStart(2, "0")}`,
      score,
    })),
  }),
  createWatchlistStoredItemSeed({
    id: "meta",
    symbol: "META",
    buyZone: { low: 430, high: 470, currency: "USD" },
    qualityScore: 78,
    opportunityScore: 63,
    status: "watchClosely",
    trigger: { summaryKey: "rows.meta.trigger" },
    action: "compare",
    isFavorite: false,
    whyWatchingKey: "rows.meta.whyWatching",
    monitorKeys: ["rows.meta.monitor.ads", "rows.meta.monitor.capex"],
    opportunityTrend: [57, 58, 60, 61, 62, 61, 63, 63].map((score, index) => ({
      date: `2026-05-${String(index + 1).padStart(2, "0")}`,
      score,
    })),
  }),
  createWatchlistStoredItemSeed({
    id: "amd",
    symbol: "AMD",
    buyZone: { low: 120, high: 140, currency: "USD" },
    qualityScore: 64,
    opportunityScore: 48,
    status: "needsMoreData",
    trigger: { summaryKey: "rows.amd.trigger" },
    action: "setAlert",
    isFavorite: false,
    whyWatchingKey: "rows.amd.whyWatching",
    monitorKeys: ["rows.amd.monitor.mi300", "rows.amd.monitor.guidance"],
    opportunityTrend: [45, 46, 47, 46, 48, 49, 47, 48].map((score, index) => ({
      date: `2026-05-${String(index + 1).padStart(2, "0")}`,
      score,
    })),
  }),
];

/** @deprecated Use initialWatchlistItems from AppDataProvider. */
export const watchlistItems = initialWatchlistItems;

export const bestOpportunities = [
  { symbol: "NVDA", logoUrl: null, value: 88 },
  { symbol: "MSFT", logoUrl: null, value: 79 },
  { symbol: "AAPL", logoUrl: null, value: 72 },
];

export const closestToBuyZone = [
  { symbol: "MSFT", logoUrl: null, value: 1.01 },
  { symbol: "AMZN", logoUrl: null, value: 1.19 },
  { symbol: "AAPL", logoUrl: null, value: 1.97 },
];

export const upcomingWatchlistEarnings = [
  { symbol: "NVDA", logoUrl: null, dateKey: "earnings.nvda" },
  { symbol: "AAPL", logoUrl: null, dateKey: "earnings.aapl" },
  { symbol: "AMZN", logoUrl: null, dateKey: "earnings.amzn" },
];

export const couldReplaceHolding = {
  candidateSymbol: "MSFT",
  candidateLogoUrl: null,
  holdingSymbol: "TSLA",
  summaryKey: "replaceHolding.msftTsla",
};

export const aiWatchlistInsight: WatchlistInsight = {
  titleKey: "sidebar.aiInsight",
  bodyKey: "insight.body",
  disclaimerKey: "insight.disclaimer",
};

export const watchlistSidebarSummary: WatchlistSidebarSummary = {
  bestOpportunities,
  closestToBuyZone,
  upcomingEarnings: upcomingWatchlistEarnings,
  couldReplaceHolding,
};
