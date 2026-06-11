"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { useTranslations } from "next-intl";
import { PageContent } from "@/components/layout/PageContent";
import { StaleDataNotice } from "@/components/ui/states/StaleDataNotice";
import { stockAnalysisMockMap } from "@/data/stocks/stock-analysis.mock";
import type { StockProviderDataBundle } from "@/data/financial-data/financial-data.types";
import type { StockAnalysisTabKey } from "@/data/stocks/stock-analysis.types";
import { useAppData } from "@/providers/useAppData";
import { mapEnrichedHoldingToUserPosition } from "@/utils/portfolio/mapEnrichedHoldingToUserPosition";
import { deriveDataSourceSummaryFromBundle } from "@/utils/financial-data/deriveDataSourceSummary";
import { enrichStockAnalysisWithBundle } from "@/utils/stocks/enrichStockAnalysisWithBundle";
import { getStockAnalysisBySymbol } from "@/utils/stocks/getStockAnalysisBySymbol";
import { normalizeStockSymbol } from "@/utils/stocks/mappers";
import { fadeUpVariants, getCardRevealTransition } from "@/utils/motion/transitions";
import { StockBreadcrumb } from "./StockBreadcrumb";
import { StockFundamentals } from "./StockFundamentals";
import { StockHeaderCard } from "./StockHeaderCard";
import { StockNewsTab } from "./StockNewsTab";
import { StockNotesTab } from "./StockNotesTab";
import { StockOverviewTab } from "./StockOverviewTab";
import { StockTabs } from "./StockTabs";

type StockAnalysisPageProps = {
  symbol: string;
  locale: string;
  initialBundle: StockProviderDataBundle;
};

export const StockAnalysisPage = ({
  symbol,
  locale,
  initialBundle,
}: StockAnalysisPageProps) => {
  const tStates = useTranslations("states");
  const prefersReducedMotion = useReducedMotion();
  const { hydrateStockData, enrichedPortfolioHoldings } = useAppData();
  const normalizedSymbol = useMemo(() => normalizeStockSymbol(symbol), [symbol]);

  useEffect(() => {
    hydrateStockData(normalizedSymbol, initialBundle);
  }, [hydrateStockData, initialBundle, normalizedSymbol]);

  const stock = useMemo(() => {
    const holding = enrichedPortfolioHoldings.find(
      (item) => item.symbol === normalizedSymbol,
    );
    const userPosition = holding
      ? mapEnrichedHoldingToUserPosition(holding)
      : null;

    return enrichStockAnalysisWithBundle(
      {
        ...getStockAnalysisBySymbol(symbol),
        userPosition,
      },
      initialBundle,
    );
  }, [enrichedPortfolioHoldings, normalizedSymbol, symbol, initialBundle]);
  const dataSourceSummary = useMemo(
    () => deriveDataSourceSummaryFromBundle(initialBundle),
    [initialBundle],
  );

  const showStaleNotice = useMemo(() => {
    const normalized = normalizeStockSymbol(symbol);
    const isMockOnlySymbol = !stockAnalysisMockMap[normalized];
    const liveFetchFailed =
      dataSourceSummary.status === "mock" || dataSourceSummary.status === "stale";
    return isMockOnlySymbol || liveFetchFailed;
  }, [dataSourceSummary.status, symbol]);
  const [activeTab, setActiveTab] = useState<StockAnalysisTabKey>("overview");

  const reveal = (index: number) => ({
    initial: prefersReducedMotion ? false : ("hidden" as const),
    animate: "show" as const,
    variants: fadeUpVariants,
    transition: getCardRevealTransition(index, prefersReducedMotion),
  });

  return (
    <PageContent>
      <MotionFull {...reveal(0)}>
        <StockBreadcrumb symbol={stock.symbol} />
      </MotionFull>

      <MotionSection {...reveal(1)}>
        <StockHeaderCard stock={stock} locale={locale} />
      </MotionSection>

      {showStaleNotice ? (
        <MotionSection {...reveal(2)}>
          <NoticeWrap>
            <StaleDataNotice
              title={tStates("stale.title")}
              description={tStates("stale.description")}
              sourceDescription={tStates(`dataSource.${dataSourceSummary.detailKey}`)}
            />
          </NoticeWrap>
        </MotionSection>
      ) : null}

      <MotionSection {...reveal(showStaleNotice ? 3 : 2)}>
        <StockTabs activeTab={activeTab} onTabChange={setActiveTab} />
      </MotionSection>

      <AnimatePresence mode="wait">
        {activeTab === "overview" && (
          <StockOverviewTab
            key="overview"
            stock={stock}
            locale={locale}
            onNavigateToTab={setActiveTab}
          />
        )}
        {activeTab === "fundamentals" && (
          <StockFundamentals
            key="fundamentals"
            stock={stock}
            locale={locale}
            freshnessStatus={dataSourceSummary.status}
          />
        )}
        {activeTab === "news" && (
          <StockNewsTab key="news" stock={stock} />
        )}
        {activeTab === "notes" && (
          <StockNotesTab key="notes" stock={stock} />
        )}
      </AnimatePresence>
    </PageContent>
  );
};

const MotionFull = styled(motion.div)`
  min-inline-size: 0;
`;

const MotionSection = styled(motion.div)`
  min-inline-size: 0;
`;

const NoticeWrap = styled.div`
  min-inline-size: 0;
`;
