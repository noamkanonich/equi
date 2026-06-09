import type { StockProviderDataBundle } from "@/data/financial-data/financial-data.types";
import type { AlertItem } from "@/data/alerts/alerts.types";
import { mergeStockProfileIntoStockItem } from "./mergeStockProfileIntoStockItem";

export const enrichAlertWithBundle = (
  alert: AlertItem,
  bundle: StockProviderDataBundle | undefined,
): AlertItem => {
  if (!alert.symbol) {
    return alert;
  }

  const withProfile = mergeStockProfileIntoStockItem(
    {
      symbol: alert.symbol,
      companyName: alert.companyName ?? alert.symbol,
      logoUrl: alert.logoUrl,
    },
    bundle,
  );

  let enriched: AlertItem = {
    ...alert,
    companyName: withProfile.companyName,
    logoUrl: withProfile.logoUrl,
  };

  if (alert.type === "price" && bundle?.quote && alert.primaryValue.kind === "money") {
    enriched = {
      ...enriched,
      primaryValue: {
        ...alert.primaryValue,
        amount: bundle.quote.price,
        currency: bundle.quote.currency,
      },
    };
  }

  return enriched;
};
