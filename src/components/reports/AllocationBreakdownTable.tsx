"use client";

import { useTranslations } from "next-intl";
import { useCallback } from "react";
import styled from "styled-components";
import { useTheme } from "styled-components";
import { chartCardHover } from "@/components/charts/chartCardChrome";
import { Link } from "@/i18n/routing";
import { DisplayMoney } from "@/components/ui/DisplayMoney";
import { SkeletonChart } from "@/components/ui/states/SkeletonChart";
import type { AllocationSectorDetail } from "@/data/reports/reports.types";
import type { CurrencyCode } from "@/data/currencies/currency.types";
import { resolveDataState } from "@/data/ui/mappers";
import type { DataState } from "@/data/ui/ui-state.types";
import { formatPercent } from "@/utils/formatting/formatPercent";

type AllocationBreakdownTableProps = {
  sectorDetails: AllocationSectorDetail[];
  totalValue: number;
  currency: CurrencyCode;
  locale: string;
  dataState?: DataState;
};

export const AllocationBreakdownTable = ({
  sectorDetails,
  totalValue,
  currency,
  locale,
  dataState,
}: AllocationBreakdownTableProps) => {
  const t = useTranslations("reports.allocation");
  const theme = useTheme();

  const effectiveState = resolveDataState({
    explicitState: dataState,
    isLoading: false,
    isEmpty: sectorDetails.length === 0,
  });

  const colors = [
    theme.colors.chart.blue,
    theme.colors.chart.green,
    theme.colors.chart.cyan,
    theme.colors.chart.amber,
    theme.colors.chart.purple,
    theme.colors.status.neutral,
  ];

  const getColor = useCallback(
    (index: number) => colors[index % colors.length],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [theme],
  );

  if (effectiveState === "loading") {
    return (
      <Card>
        <Title>{t("breakdown.title")}</Title>
        <SkeletonChart $height="20rem" />
      </Card>
    );
  }

  return (
    <Card>
      <Title>{t("breakdown.title")}</Title>
      <SectorList>
        {sectorDetails.map((sector, index) => (
          <SectorRow key={sector.key}>
            <SectorHeader>
              <SectorMeta>
                <ColorDot $color={getColor(index)} />
                <SectorName>{t(`sectors.${sector.key}`)}</SectorName>
              </SectorMeta>
              <SectorStats>
                <SectorPercent>
                  {formatPercent(sector.percent, { locale, decimals: 1, showSign: false })}
                </SectorPercent>
                <SectorValue>
                  <DisplayMoney
                    amount={sector.value}
                    currency={currency}
                    locale={locale}
                    layout="inline"
                  />
                </SectorValue>
              </SectorStats>
            </SectorHeader>

            <BarTrack>
              <BarFill
                $color={getColor(index)}
                style={{ inlineSize: `${Math.max(sector.percent, 1)}%` }}
              />
            </BarTrack>

            {sector.holdings.length > 0 ? (
              <HoldingsList>
                {sector.holdings.map((holding) => (
                  <HoldingChip key={holding.symbol}>
                    <HoldingLink href={`/stocks/${holding.symbol}`} dir="ltr">
                      {holding.symbol}
                    </HoldingLink>
                    <HoldingWeight>
                      {formatPercent(holding.weightPercent, {
                        locale,
                        decimals: 1,
                        showSign: false,
                      })}
                    </HoldingWeight>
                  </HoldingChip>
                ))}
              </HoldingsList>
            ) : sector.key === "cash" ? null : (
              <NoHoldings>{t("breakdown.noHoldings")}</NoHoldings>
            )}
          </SectorRow>
        ))}
      </SectorList>

      <TotalRow>
        <TotalLabel>{t("total")}</TotalLabel>
        <TotalValue>
          <DisplayMoney
            amount={totalValue}
            currency={currency}
            locale={locale}
            layout="inline"
          />
        </TotalValue>
      </TotalRow>
    </Card>
  );
};

// ─── Styled Components ────────────────────────────────────────────────────────

const Card = styled.section`
  ${chartCardHover}
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.lg};
  background: ${({ theme }) => theme.colors.background.card};
  border: 1px solid ${({ theme }) => theme.colors.border.subtle};
  border-radius: ${({ theme }) => theme.radius.lg};
  box-shadow: ${({ theme }) => theme.colors.shadow.soft};
  min-inline-size: 0;
`;

const Title = styled.h2`
  margin: 0;
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.preset.sectionTitle.fontSize};
  font-weight: ${({ theme }) => theme.typography.preset.sectionTitle.fontWeight};
  line-height: ${({ theme }) => theme.typography.preset.sectionTitle.lineHeight};
`;

const SectorList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
  margin: 0;
  padding: 0;
  list-style: none;
`;

const SectorRow = styled.li`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const SectorHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.md};
`;

const SectorMeta = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  min-inline-size: 0;
`;

const ColorDot = styled.span<{ $color: string }>`
  flex-shrink: 0;
  inline-size: 0.625rem;
  block-size: 0.625rem;
  border-radius: 999px;
  background: ${({ $color }) => $color};
`;

const SectorName = styled.span`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.preset.body.fontSize};
  font-weight: ${({ theme }) => theme.typography.weight.medium};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const SectorStats = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  flex-shrink: 0;
`;

const SectorPercent = styled.span`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.preset.body.fontSize};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
`;

const SectorValue = styled.span`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.preset.caption.fontSize};

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet - 1}px) {
    display: none;
  }
`;

const BarTrack = styled.div`
  inline-size: 100%;
  block-size: 0.375rem;
  border-radius: 999px;
  background: ${({ theme }) => theme.colors.background.elevated};
  overflow: hidden;
`;

const BarFill = styled.span<{ $color: string }>`
  display: block;
  block-size: 100%;
  border-radius: inherit;
  background: ${({ $color }) => $color};
  transition: inline-size 0.6s cubic-bezier(0.22, 1, 0.36, 1);
`;

const HoldingsList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.xs};
  margin-block-start: 2px;
`;

const HoldingChip = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px ${({ theme }) => theme.spacing.xs};
  border-radius: ${({ theme }) => theme.radius.sm};
  background: ${({ theme }) => theme.colors.background.elevated};
  border: 1px solid ${({ theme }) => theme.colors.border.subtle};
`;

const HoldingLink = styled(Link)`
  color: ${({ theme }) => theme.colors.brand.primary};
  font-size: ${({ theme }) => theme.typography.size.xs};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

const HoldingWeight = styled.span`
  color: ${({ theme }) => theme.colors.text.muted};
  font-size: ${({ theme }) => theme.typography.size.xs};
`;

const NoHoldings = styled.span`
  color: ${({ theme }) => theme.colors.text.muted};
  font-size: ${({ theme }) => theme.typography.size.xs};
`;

const TotalRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-block-start: ${({ theme }) => theme.spacing.sm};
  border-block-start: 1px solid ${({ theme }) => theme.colors.border.subtle};
`;

const TotalLabel = styled.span`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.preset.caption.fontSize};
  font-weight: ${({ theme }) => theme.typography.weight.medium};
`;

const TotalValue = styled.span`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.preset.body.fontSize};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
`;
