export type NavLabelKey =
  | "dashboard"
  | "portfolio"
  | "watchlist"
  | "nextMoves"
  | "reports"
  | "news"
  | "fundamentalAnalysis"
  | "stockAnalysis"
  | "smartReplace"
  | "alerts"
  | "settings";

export type NavIconKey =
  | "layoutDashboard"
  | "briefcase"
  | "eye"
  | "sparkles"
  | "fileText"
  | "newspaper"
  | "chartColumnIncreasing"
  | "lineChart"
  | "arrowLeftRight"
  | "bell"
  | "settings";

export interface NavItem {
  href: string;
  labelKey: NavLabelKey;
  iconKey: NavIconKey;
  badgeCount?: number;
}

export const navigationItems: NavItem[] = [
  { href: "/", labelKey: "dashboard", iconKey: "layoutDashboard" },
  { href: "/portfolio", labelKey: "portfolio", iconKey: "briefcase" },
  { href: "/watchlist", labelKey: "watchlist", iconKey: "eye" },
  {
    href: "/next-moves",
    labelKey: "nextMoves",
    iconKey: "sparkles",
    badgeCount: 6,
  },
  { href: "/reports", labelKey: "reports", iconKey: "fileText" },
  { href: "/news", labelKey: "news", iconKey: "newspaper" },
  {
    href: "/fundamental-analysis",
    labelKey: "fundamentalAnalysis",
    iconKey: "chartColumnIncreasing",
  },
  {
    href: "/stocks/NVDA",
    labelKey: "stockAnalysis",
    iconKey: "lineChart",
  },
  {
    href: "/smart-replace",
    labelKey: "smartReplace",
    iconKey: "arrowLeftRight",
  },
  { href: "/alerts", labelKey: "alerts", iconKey: "bell" },
  { href: "/settings", labelKey: "settings", iconKey: "settings" },
];
