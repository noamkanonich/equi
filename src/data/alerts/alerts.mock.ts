import type {
  AlertItem,
  AlertQuickFilter,
  AlertSummaryBreakdown,
  AlertSummaryMetric,
  AlertTab,
  SnoozedAlertsSummary,
} from "./alerts.types";
import { companyProfileLogoUrls } from "@/data/stocks/company-profile-logos.mock";

const hoursAgo = (hours: number) =>
  new Date(Date.now() - hours * 60 * 60 * 1000).toISOString();

const daysAgo = (days: number) =>
  new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();

const minutesAgo = (minutes: number) =>
  new Date(Date.now() - minutes * 60 * 1000).toISOString();

export const alertSummaryMetrics: AlertSummaryMetric[] = [
  {
    kind: "activeAlerts",
    value: 24,
    newCount: 4,
    trend: [12, 14, 16, 18, 20, 22, 24],
  },
  {
    kind: "priceAlerts",
    value: 10,
    newCount: 2,
    trend: [4, 5, 6, 7, 8, 9, 10],
  },
  {
    kind: "earningsAlerts",
    value: 6,
    newCount: 1,
    trend: [2, 3, 3, 4, 5, 5, 6],
  },
  {
    kind: "portfolioAlerts",
    value: 5,
    newCount: null,
    trend: [3, 3, 4, 4, 5, 5, 5],
  },
  {
    kind: "smartReplace",
    value: 3,
    newCount: 1,
    trend: [1, 1, 2, 2, 2, 3, 3],
  },
];

export const alertSummaryBreakdown: AlertSummaryBreakdown[] = [
  { key: "price", value: 10, percent: 42 },
  { key: "earnings", value: 6, percent: 25 },
  { key: "portfolio", value: 5, percent: 21 },
  { key: "smartReplace", value: 3, percent: 12 },
];

export const alertQuickFilters: AlertQuickFilter[] = [
  { key: "highPriority", count: 6, tone: "negative", filterType: "high" as const },
  { key: "priceAlerts", count: 10, tone: "neutral", filterType: "price" },
  { key: "earningsAlerts", count: 6, tone: "warning", filterType: "earnings" },
  { key: "buyZoneAlerts", count: 4, tone: "positive", filterType: "buyZone" },
  { key: "scoreAlerts", count: 2, tone: "neutral", filterType: "score" },
  { key: "portfolioRisks", count: 5, tone: "warning", filterType: "portfolio" },
];

export const snoozedAlertsSummary: SnoozedAlertsSummary = {
  count: 2,
};

const featuredAlerts: AlertItem[] = [
  {
    id: "tsla-price-triggered",
    type: "price",
    priority: "high",
    status: "triggered",
    source: "watchlist",
    symbol: "TSLA",
    companyName: "Tesla, Inc.",
    logoUrl: companyProfileLogoUrls.TSLA,
    titleKey: "items.tslaPriceTriggered.title",
    descriptionKey: "items.tslaPriceTriggered.description",
    triggeredAt: minutesAgo(10),
    createdAt: daysAgo(14),
    timestampKey: "list.triggeredAgo",
    timestampParams: { minutes: 10 },
    primaryValue: { kind: "money", amount: 172.34, currency: "USD" },
    secondaryValue: { kind: "percent", value: -3.21 },
    isHighlighted: true,
  },
  {
    id: "nvda-earnings",
    type: "earnings",
    priority: "medium",
    status: "active",
    source: "watchlist",
    symbol: "NVDA",
    companyName: "NVIDIA Corporation",
    logoUrl: companyProfileLogoUrls.NVDA,
    titleKey: "items.nvdaEarnings.title",
    descriptionKey: "items.nvdaEarnings.description",
    createdAt: hoursAgo(2),
    timestampKey: "list.hoursAgo",
    timestampParams: { hours: 2 },
    primaryValue: { kind: "date", value: "2026-05-22" },
  },
  {
    id: "portfolio-concentration",
    type: "portfolio",
    priority: "medium",
    status: "active",
    source: "portfolio",
    titleKey: "items.portfolioConcentration.title",
    descriptionKey: "items.portfolioConcentration.description",
    createdAt: hoursAgo(4),
    timestampKey: "list.hoursAgo",
    timestampParams: { hours: 4 },
    primaryValue: { kind: "percent", value: 34.2 },
    secondaryValue: { kind: "percent", value: 4.2 },
  },
  {
    id: "googl-buy-zone",
    type: "buyZone",
    priority: "low",
    status: "active",
    source: "watchlist",
    symbol: "GOOGL",
    companyName: "Alphabet Inc.",
    logoUrl: companyProfileLogoUrls.GOOGL,
    titleKey: "items.googlBuyZone.title",
    descriptionKey: "items.googlBuyZone.description",
    createdAt: hoursAgo(6),
    timestampKey: "list.hoursAgo",
    timestampParams: { hours: 6 },
    primaryValue: { kind: "money", amount: 158.42, currency: "USD" },
    secondaryValue: { kind: "textKey", valueKey: "list.inBuyZone" },
  },
  {
    id: "tsla-smart-replace",
    type: "smartReplace",
    priority: "info",
    status: "active",
    source: "portfolio",
    symbol: "TSLA",
    companyName: "Tesla, Inc.",
    logoUrl: companyProfileLogoUrls.TSLA,
    titleKey: "items.smartReplaceOpportunity.title",
    descriptionKey: "items.smartReplaceOpportunity.description",
    createdAt: daysAgo(1),
    timestampKey: "list.dayAgo",
    timestampParams: { days: 1 },
    primaryValue: { kind: "points", value: 21 },
    secondaryValue: { kind: "textKey", valueKey: "list.scoreImprovement" },
  },
  {
    id: "msft-analyst-upgrade",
    type: "analyst",
    priority: "low",
    status: "active",
    source: "watchlist",
    symbol: "MSFT",
    companyName: "Microsoft Corp.",
    logoUrl: companyProfileLogoUrls.MSFT,
    titleKey: "items.msftAnalystUpgrade.title",
    descriptionKey: "items.msftAnalystUpgrade.description",
    createdAt: daysAgo(1),
    timestampKey: "list.dayAgo",
    timestampParams: { days: 1 },
    primaryValue: { kind: "text", valueKey: "list.overweight" },
    secondaryValue: { kind: "textKey", valueKey: "list.upgraded" },
  },
];

const fillerAlerts: AlertItem[] = [
  {
    id: "aapl-price-active",
    type: "price",
    priority: "medium",
    status: "active",
    source: "watchlist",
    symbol: "AAPL",
    companyName: "Apple Inc.",
    logoUrl: companyProfileLogoUrls.AAPL,
    titleKey: "items.aaplPriceActive.title",
    descriptionKey: "items.aaplPriceActive.description",
    createdAt: hoursAgo(8),
    timestampKey: "list.hoursAgo",
    timestampParams: { hours: 8 },
    primaryValue: { kind: "money", amount: 189.5, currency: "USD" },
    secondaryValue: { kind: "percent", value: 1.2 },
  },
  {
    id: "meta-earnings-triggered",
    type: "earnings",
    priority: "high",
    status: "triggered",
    source: "watchlist",
    symbol: "META",
    companyName: "Meta Platforms, Inc.",
    logoUrl: companyProfileLogoUrls.META,
    titleKey: "items.metaEarningsTriggered.title",
    descriptionKey: "items.metaEarningsTriggered.description",
    triggeredAt: hoursAgo(1),
    createdAt: daysAgo(3),
    timestampKey: "list.hoursAgo",
    timestampParams: { hours: 1 },
    primaryValue: { kind: "date", value: "2026-05-28" },
  },
  {
    id: "amzn-buy-zone",
    type: "buyZone",
    priority: "low",
    status: "active",
    source: "watchlist",
    symbol: "AMZN",
    companyName: "Amazon.com, Inc.",
    logoUrl: companyProfileLogoUrls.AMZN,
    titleKey: "items.amznBuyZone.title",
    descriptionKey: "items.amznBuyZone.description",
    createdAt: hoursAgo(12),
    timestampKey: "list.hoursAgo",
    timestampParams: { hours: 12 },
    primaryValue: { kind: "money", amount: 178.25, currency: "USD" },
    secondaryValue: { kind: "textKey", valueKey: "list.inBuyZone" },
  },
  {
    id: "portfolio-dividend-risk",
    type: "portfolio",
    priority: "medium",
    status: "active",
    source: "portfolio",
    titleKey: "items.portfolioDividend.title",
    descriptionKey: "items.portfolioDividend.description",
    createdAt: hoursAgo(18),
    timestampKey: "list.hoursAgo",
    timestampParams: { hours: 18 },
    primaryValue: { kind: "percent", value: 8.5 },
    secondaryValue: { kind: "textKey", valueKey: "list.belowTarget" },
  },
  {
    id: "avgo-score-alert",
    type: "score",
    priority: "low",
    status: "active",
    source: "watchlist",
    symbol: "AVGO",
    companyName: "Broadcom Inc.",
    logoUrl: null,
    titleKey: "items.avgoScore.title",
    descriptionKey: "items.avgoScore.description",
    createdAt: daysAgo(2),
    timestampKey: "list.dayAgo",
    timestampParams: { days: 2 },
    primaryValue: { kind: "points", value: 88 },
    secondaryValue: { kind: "textKey", valueKey: "list.scoreImproved" },
  },
  {
    id: "jpm-smart-replace-snoozed",
    type: "smartReplace",
    priority: "info",
    status: "snoozed",
    source: "portfolio",
    symbol: "JPM",
    companyName: "JPMorgan Chase & Co.",
    logoUrl: null,
    titleKey: "items.jpmSmartReplace.title",
    descriptionKey: "items.jpmSmartReplace.description",
    createdAt: daysAgo(3),
    timestampKey: "list.dayAgo",
    timestampParams: { days: 3 },
    primaryValue: { kind: "points", value: 15 },
    secondaryValue: { kind: "textKey", valueKey: "list.scoreImprovement" },
  },
  {
    id: "cost-earnings-snoozed",
    type: "earnings",
    priority: "medium",
    status: "snoozed",
    source: "watchlist",
    symbol: "COST",
    companyName: "Costco Wholesale Corp.",
    logoUrl: null,
    titleKey: "items.costEarnings.title",
    descriptionKey: "items.costEarnings.description",
    createdAt: daysAgo(4),
    timestampKey: "list.dayAgo",
    timestampParams: { days: 4 },
    primaryValue: { kind: "date", value: "2026-06-05" },
  },
];

const dismissedAlerts: AlertItem[] = Array.from({ length: 18 }, (_, index) => {
  const symbols = ["AAPL", "MSFT", "NVDA", "GOOGL", "AMZN", "TSLA", "META"] as const;
  const symbol = symbols[index % symbols.length];
  const types = ["price", "earnings", "score", "buyZone", "portfolio", "analyst"] as const;
  const type = types[index % types.length];

  return {
    id: `dismissed-${index + 1}`,
    type,
    priority: index % 4 === 0 ? "high" : index % 3 === 0 ? "medium" : "low",
    status: "dismissed" as const,
    source: type === "portfolio" ? ("portfolio" as const) : ("watchlist" as const),
    ...(type !== "portfolio"
      ? {
          symbol,
          companyName: `${symbol} Corp.`,
          logoUrl: companyProfileLogoUrls[symbol],
        }
      : {}),
    titleKey: `items.dismissed.${index + 1}.title`,
    descriptionKey: `items.dismissed.${index + 1}.description`,
    createdAt: daysAgo(index + 5),
    timestampKey: "list.dayAgo",
    timestampParams: { days: index + 5 },
    primaryValue:
      type === "price" || type === "buyZone"
        ? { kind: "money" as const, amount: 100 + index * 5, currency: "USD" as const }
        : type === "earnings"
          ? { kind: "date" as const, value: "2026-04-15" }
          : type === "portfolio"
            ? { kind: "percent" as const, value: 25 + index }
            : { kind: "text" as const, valueKey: "list.dismissed" },
  };
});

const extraTriggered: AlertItem[] = [
  {
    id: "nvda-price-triggered",
    type: "price",
    priority: "high",
    status: "triggered",
    source: "watchlist",
    symbol: "NVDA",
    companyName: "NVIDIA Corporation",
    logoUrl: companyProfileLogoUrls.NVDA,
    titleKey: "items.nvdaPriceTriggered.title",
    descriptionKey: "items.nvdaPriceTriggered.description",
    triggeredAt: hoursAgo(3),
    createdAt: daysAgo(7),
    timestampKey: "list.hoursAgo",
    timestampParams: { hours: 3 },
    primaryValue: { kind: "money", amount: 890.12, currency: "USD" },
    secondaryValue: { kind: "percent", value: -2.5 },
  },
  {
    id: "aapl-earnings-triggered",
    type: "earnings",
    priority: "medium",
    status: "triggered",
    source: "watchlist",
    symbol: "AAPL",
    companyName: "Apple Inc.",
    logoUrl: companyProfileLogoUrls.AAPL,
    titleKey: "items.aaplEarningsTriggered.title",
    descriptionKey: "items.aaplEarningsTriggered.description",
    triggeredAt: daysAgo(2),
    createdAt: daysAgo(10),
    timestampKey: "list.dayAgo",
    timestampParams: { days: 2 },
    primaryValue: { kind: "date", value: "2026-05-01" },
  },
];

export const alerts: AlertItem[] = [
  ...featuredAlerts,
  ...fillerAlerts,
  ...extraTriggered,
  ...dismissedAlerts,
];

export const defaultAlertFilters = {
  searchQuery: "",
  quickFilterKey: null,
  tab: "allAlerts" as AlertTab,
  sort: "newest" as const,
};
