import type {
  AlertFilters,
  AlertItem,
  AlertTab,
} from "@/data/alerts/alerts.types";
import type { AlertQuickFilter } from "@/data/alerts/alerts.types";

const tabStatusMap: Record<AlertTab, (item: AlertItem) => boolean> = {
  allAlerts: (item) => item.status !== "dismissed",
  active: (item) => item.status === "active" || item.status === "triggered",
  triggered: (item) => item.status === "triggered",
  snoozed: (item) => item.status === "snoozed",
  dismissed: (item) => item.status === "dismissed",
};

export const matchesQuickFilter = (
  item: AlertItem,
  filter: AlertQuickFilter,
): boolean => {
  const { filterType } = filter;

  if (filterType === "high") {
    return item.priority === "high";
  }

  if (filterType === "portfolio") {
    return item.type === "portfolio";
  }

  return item.type === filterType;
};

export const filterAlertsByTab = (
  items: AlertItem[],
  tab: AlertTab,
): AlertItem[] => items.filter(tabStatusMap[tab]);

export const filterAlerts = (
  items: AlertItem[],
  filters: AlertFilters,
  quickFilters: AlertQuickFilter[],
  searchKeys: Record<string, string>,
): AlertItem[] => {
  let result = filterAlertsByTab(items, filters.tab);

  if (filters.quickFilterKey) {
    const quickFilter = quickFilters.find(
      (filter) => filter.key === filters.quickFilterKey,
    );
    if (quickFilter) {
      result = result.filter((item) => matchesQuickFilter(item, quickFilter));
    }
  }

  if (filters.searchQuery.trim()) {
    const query = filters.searchQuery.trim().toLowerCase();
    result = result.filter((item) => {
      const title = searchKeys[item.titleKey]?.toLowerCase() ?? "";
      const description = searchKeys[item.descriptionKey]?.toLowerCase() ?? "";
      const symbol = item.symbol?.toLowerCase() ?? "";
      const company = item.companyName?.toLowerCase() ?? "";
      return (
        title.includes(query) ||
        description.includes(query) ||
        symbol.includes(query) ||
        company.includes(query)
      );
    });
  }

  return result;
};
