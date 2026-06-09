import type { SwapImpactMetric } from "@/data/smart-replace/smart-replace.types";
import { formatPercent } from "@/utils/formatting/formatPercent";

export const formatSwapImpactValue = (
  value: number,
  metric: Pick<SwapImpactMetric, "unit" | "decimals">,
  locale: string,
) => {
  if (metric.unit === "points") {
    return new Intl.NumberFormat(locale, {
      maximumFractionDigits: 0,
    }).format(value);
  }

  if (metric.unit === "beta") {
    return `${new Intl.NumberFormat(locale, {
      minimumFractionDigits: metric.decimals,
      maximumFractionDigits: metric.decimals,
    }).format(value)} beta`;
  }

  return formatPercent(value, {
    decimals: metric.decimals,
    locale,
    showSign: true,
  });
};
