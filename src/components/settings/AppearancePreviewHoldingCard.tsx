"use client";

import { useTranslations } from "next-intl";
import styled from "styled-components";
import { MiniSparklineChart } from "@/components/charts/MiniSparklineChart";
import { StockLogo } from "@/components/ui/StockLogo";
import { CardTitle, PreviewCard } from "./appearancePreviewPrimitives";

type AppearancePreviewHoldingCardProps = {
  cardRadius: string;
  padding: "sm" | "md";
  isCompact: boolean;
};

const holdingSparkline = [42, 48, 45, 52, 58, 55, 62, 68, 64, 72];

export const AppearancePreviewHoldingCard = ({
  cardRadius,
  padding,
  isCompact,
}: AppearancePreviewHoldingCardProps) => {
  const t = useTranslations("settings.appearance.preview");

  return (
    <PreviewCard $padding={padding} $radius={cardRadius}>
      <CardTitle>{t("topHolding")}</CardTitle>
      <HoldingSectionSpacer $compact={isCompact} />
      <HoldingRow>
        <StockLogo symbol="AAPL" companyName="Apple Inc." size="md" />
        <HoldingCopy>
          <HoldingSymbol dir="ltr">AAPL</HoldingSymbol>
          <HoldingName>Apple Inc.</HoldingName>
          <HoldingMetaLine>{t("holdingCategory")}</HoldingMetaLine>
        </HoldingCopy>
        <HoldingPriceBlock>
          <HoldingPrice dir="ltr">$195.42</HoldingPrice>
          <HoldingChange dir="ltr">{t("holdingChange")}</HoldingChange>
        </HoldingPriceBlock>
        <SparkWrap>
          <MiniSparklineChart
            data={holdingSparkline}
            variant="positive"
            height={32}
            showArea={false}
            ariaLabel={t("topHolding")}
          />
        </SparkWrap>
      </HoldingRow>
    </PreviewCard>
  );
};

const HoldingSectionSpacer = styled.div<{ $compact: boolean }>`
  block-size: ${({ theme, $compact }) =>
    $compact ? theme.spacing.xs : theme.spacing.sm};
`;

const HoldingRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  min-inline-size: 0;
`;

const HoldingCopy = styled.div`
  flex: 1;
  min-inline-size: 0;
`;

const HoldingSymbol = styled.span`
  display: block;
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.preset.body.fontSize};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
  line-height: ${({ theme }) => theme.typography.lineHeight.tight};
`;

const HoldingName = styled.span`
  display: block;
  margin-block-start: ${({ theme }) => theme.spacing.xs};
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.size.xs};
  line-height: ${({ theme }) => theme.typography.lineHeight.normal};
`;

const HoldingMetaLine = styled.span`
  display: block;
  margin-block-start: ${({ theme }) => theme.spacing.xs};
  color: ${({ theme }) => theme.colors.text.muted};
  font-size: ${({ theme }) => theme.typography.size.xs};
  line-height: ${({ theme }) => theme.typography.lineHeight.normal};
`;

const HoldingPriceBlock = styled.div`
  display: flex;
  flex-direction: column;
  align-items: end;
  gap: ${({ theme }) => theme.spacing.xs};
  flex-shrink: 0;
`;

const HoldingPrice = styled.span`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.preset.body.fontSize};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
`;

const HoldingChange = styled.span`
  color: ${({ theme }) => theme.colors.status.positive};
  font-size: ${({ theme }) => theme.typography.size.xs};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
`;

const SparkWrap = styled.div`
  inline-size: 4.75rem;
  block-size: 2rem;
  flex-shrink: 0;
`;
