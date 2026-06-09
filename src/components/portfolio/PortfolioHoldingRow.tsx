"use client";

import { PortfolioHoldingActionsMenu } from "./PortfolioHoldingActionsMenu";
import { useTranslations } from "next-intl";
import type { KeyboardEvent } from "react";
import styled, { css } from "styled-components";
import { Cell, TableRow } from "@/components/ui/DataTableShell";
import { DisplayMoney } from "@/components/ui/DisplayMoney";
import { ActionBadge } from "@/components/ui/ActionBadge";
import { ScoreBadge } from "@/components/ui/ScoreBadge";
import { StockLogo } from "@/components/ui/StockLogo";
import { RecentDayChanges } from "@/components/ui/RecentDayChanges";
import type { PortfolioHoldingView } from "@/data/portfolio/portfolio.types";
import { mapScoreToBadgeTone } from "@/data/portfolio/mappers";
import { useRouter } from "@/i18n/routing";
import { formatPercent } from "@/utils/formatting/formatPercent";

type PortfolioHoldingRowProps = {
  holding: PortfolioHoldingView;
  locale: string;
};

export const PortfolioHoldingRow = ({
  holding,
  locale,
}: PortfolioHoldingRowProps) => {
  const t = useTranslations("portfolio");
  const tCommon = useTranslations("common");
  const router = useRouter();
  const hasLivePrice = holding.market !== "IL";

  const handleNavigate = () => {
    router.push(`/stocks/${holding.symbol}`);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTableRowElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleNavigate();
    }
  };

  return (
    <TableRow
      $clickable
      onClick={handleNavigate}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="link"
      aria-label={t("holdings.rowAria", { symbol: holding.symbol })}
    >
      <Cell>
        <SymbolWrap dir="ltr">
          <StockLogo
            symbol={holding.symbol}
            companyName={holding.companyName}
            logoUrl={holding.logoUrl}
          />
          <Symbol>{holding.symbol}</Symbol>
        </SymbolWrap>
      </Cell>
      <Cell>
        <Company>{holding.companyName}</Company>
      </Cell>
      <Cell $numeric>{holding.shares}</Cell>
      <Cell $numeric>
        <DisplayMoney
          amount={holding.averageCost}
          currency={holding.purchaseCurrency}
          locale={locale}
        />
      </Cell>
      <Cell $numeric>
        {hasLivePrice ? (
          <DisplayMoney
            amount={holding.currentPrice}
            currency={holding.purchaseCurrency}
            locale={locale}
          />
        ) : (
          <UnavailableText>{t("holdings.priceUnavailable")}</UnavailableText>
        )}
      </Cell>
      <ToneCell $numeric $tone={holding.tone}>
        {hasLivePrice ? formatPercent(holding.dayChangePercent, { locale }) : t("holdings.priceUnavailable")}
      </ToneCell>
      <Cell $numeric>
        {hasLivePrice ? (
          <DisplayMoney
            amount={holding.marketValue}
            currency={holding.purchaseCurrency}
            locale={locale}
          />
        ) : (
          <UnavailableText>{t("holdings.priceUnavailable")}</UnavailableText>
        )}
      </Cell>
      <ToneCell
        $numeric
        $tone={holding.gainLossAmount >= 0 ? "positive" : "negative"}
      >
        {hasLivePrice ? (
          <ReturnStack>
            <span>{formatPercent(holding.gainLossPercent, { locale })}</span>
            <DisplayMoney
              amount={holding.gainLossAmount}
              currency={holding.purchaseCurrency}
              locale={locale}
              inheritColor
            />
          </ReturnStack>
        ) : (
          <UnavailableText>{t("holdings.priceUnavailable")}</UnavailableText>
        )}
      </ToneCell>
      <Cell $numeric>
        {hasLivePrice
          ? formatPercent(holding.weightPercent, {
              decimals: 1,
              locale,
              showSign: false,
            })
          : t("holdings.priceUnavailable")}
      </Cell>
      <Cell $center>
        <RecentChangesSlot>
          <RecentDayChanges
            changes={holding.recentDayChanges}
            locale={locale}
            compact
          />
        </RecentChangesSlot>
      </Cell>
      <Cell $center>
        {hasLivePrice ? (
          <ScoreBadge score={holding.score} $tone={mapScoreToBadgeTone(holding.score)} />
        ) : (
          <UnavailableText>{t("holdings.priceUnavailable")}</UnavailableText>
        )}
      </Cell>
      <Cell $center>
        <ActionBadge action={holding.suggestedAction}>
          {tCommon(holding.suggestedAction)}
        </ActionBadge>
      </Cell>
      <Cell $center>
        <PortfolioHoldingActionsMenu
          holding={holding}
          ariaLabel={t("holdings.columns.more")}
        />
      </Cell>
    </TableRow>
  );
};

const toneStyles = {
  positive: css`
    color: ${({ theme }) => theme.colors.status.positive};
  `,
  negative: css`
    color: ${({ theme }) => theme.colors.status.negative};
  `,
  neutral: css`
    color: ${({ theme }) => theme.colors.text.secondary};
  `,
};

const ToneCell = styled(Cell)<{ $tone: PortfolioHoldingView["tone"] }>`
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
  ${({ $tone }) => toneStyles[$tone]}
`;

const SymbolWrap = styled.div`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const Symbol = styled.strong`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.preset.tableText.fontSize};
  font-weight: ${({ theme }) => theme.typography.weight.bold};
`;

const Company = styled.span`
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const ReturnStack = styled.span`
  display: inline-flex;
  flex-direction: column;
  align-items: flex-end;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const UnavailableText = styled.span`
  color: ${({ theme }) => theme.colors.text.muted};
  font-size: ${({ theme }) => theme.typography.size.xs};
  font-weight: ${({ theme }) => theme.typography.weight.medium};
`;

const RecentChangesSlot = styled.div`
  min-inline-size: 15rem;
`;
