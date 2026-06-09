import { setRequestLocale } from "next-intl/server";
import { StockAnalysisPage } from "@/components/stocks/StockAnalysisPage";
import { buildMockStockDataBundle } from "@/data/financial-data/financial-data.mock";
import { normalizeProviderSymbol } from "@/data/financial-data/mappers";
import type { StockProviderDataBundle } from "@/data/financial-data/financial-data.types";
import { getStockDataBundle } from "@/utils/financial-data/getStockDataBundle";

type Props = {
  params: Promise<{ locale: string; symbol: string }>;
};

const StockPage = async ({ params }: Props) => {
  const { locale, symbol } = await params;
  setRequestLocale(locale);

  let initialBundle: StockProviderDataBundle;
  try {
    initialBundle = await getStockDataBundle(symbol, { scope: "full" });
  } catch {
    initialBundle = buildMockStockDataBundle(normalizeProviderSymbol(symbol));
  }

  return (
    <StockAnalysisPage
      symbol={symbol}
      locale={locale}
      initialBundle={initialBundle}
    />
  );
};

export default StockPage;
