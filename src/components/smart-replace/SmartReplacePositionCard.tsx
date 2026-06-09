"use client";

import { CheckCircle2, CircleAlert } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import styled, { css } from "styled-components";
import { Badge } from "@/components/ui/Badge";
import { CircularScore } from "@/components/ui/CircularScore";
import { DisplayMoney } from "@/components/ui/DisplayMoney";
import { StockLogo } from "@/components/ui/StockLogo";
import type {
  ReplacementCandidate,
  SmartReplaceTone,
  WeakPosition,
} from "@/data/smart-replace/smart-replace.types";
import { formatPercent } from "@/utils/formatting/formatPercent";
import { SOFT_EASE } from "@/utils/motion/transitions";
import { getSmartReplaceTranslationKey } from "@/utils/smart-replace/getSmartReplaceTranslationKey";
import { getSuggestedAction } from "@/utils/scoring/getSuggestedAction";
import { mapSuggestedActionToTone } from "@/utils/scoring/mappers";

type SmartReplacePositionCardProps = {
  variant: "current" | "replacement";
  position?: WeakPosition;
  candidate?: ReplacementCandidate;
  locale: string;
  isPreviewActive: boolean;
  animationKey: number;
  onApplySwap?: () => void;
};

export const SmartReplacePositionCard = ({
  variant,
  position,
  candidate,
  locale,
  isPreviewActive,
  animationKey,
  onApplySwap,
}: SmartReplacePositionCardProps) => {
  const t = useTranslations("smartReplace");
  const prefersReducedMotion = useReducedMotion();
  const isReplacement = variant === "replacement";
  const stock = isReplacement ? candidate : position;

  if (!stock) return null;

  const suggestedAction =
    isReplacement || !position
      ? getSuggestedAction(stock.score)
      : position.suggestedAction;
  const listKeys = isReplacement
    ? (candidate?.positives ?? [])
    : (position?.concerns ?? []);

  return (
    <Card
      key={`${stock.symbol}-${animationKey}-${variant}`}
      $variant={variant}
      $preview={isPreviewActive}
      initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: prefersReducedMotion ? 0 : 0.32,
        ease: SOFT_EASE,
      }}
    >
      <Header>
        <StockIdentity>
          <StockLogo
            symbol={stock.symbol}
            companyName={stock.companyName}
            logoUrl={stock.logoUrl}
            size="lg"
          />
          <StockCopy>
            <Symbol dir="ltr">{stock.symbol}</Symbol>
            <Company>{stock.companyName}</Company>
          </StockCopy>
        </StockIdentity>
        <CircularScore
          score={stock.score}
          size="md"
          ariaLabel={t("labels.scoreAria", { score: stock.score })}
        />
      </Header>

      <ActionRow>
        <SectorBadge $tone={isReplacement ? "positive" : "neutral"}>
          {t(getSmartReplaceTranslationKey(stock.sectorKey))}
        </SectorBadge>
      </ActionRow>

      <Details>
        {isReplacement && candidate ? (
          <>
            <DetailRow>
              <span>{t("labels.estimatedWeight")}</span>
              <strong dir="ltr">
                {formatPercent(candidate.estimatedWeightPercent, {
                  locale,
                  decimals: 1,
                  showSign: false,
                })}
              </strong>
            </DetailRow>
            <DetailRow>
              <span>{t("labels.currentPrice")}</span>
              <strong>
                <DisplayMoney
                  amount={candidate.currentPrice}
                  currency={candidate.currency}
                  locale={locale}
                  layout="inline"
                  inheritColor
                />
              </strong>
            </DetailRow>
            <DetailRow>
              <span>{t("labels.upsidePotential")}</span>
              <StrongPositive dir="ltr">
                {formatPercent(candidate.upsidePercent, {
                  locale,
                  decimals: 1,
                })}
              </StrongPositive>
            </DetailRow>
            <DetailRow>
              <span>{t("labels.analystConsensus")}</span>
              <StrongPositive>
                {t(
                  getSmartReplaceTranslationKey(candidate.analystConsensusKey),
                )}
              </StrongPositive>
            </DetailRow>
          </>
        ) : null}

        {!isReplacement && position ? (
          <>
            <DetailRow>
              <span>{t("labels.currentWeight")}</span>
              <strong dir="ltr">
                {formatPercent(position.currentWeightPercent, {
                  locale,
                  decimals: 1,
                  showSign: false,
                })}
              </strong>
            </DetailRow>
            <DetailRow>
              <span>{t("labels.avgCost")}</span>
              <strong>
                <DisplayMoney
                  amount={position.avgCost}
                  currency={position.currency}
                  locale={locale}
                  layout="inline"
                  inheritColor
                />
              </strong>
            </DetailRow>
            <DetailRow>
              <span>{t("labels.marketValue")}</span>
              <strong>
                <DisplayMoney
                  amount={position.marketValue}
                  currency={position.currency}
                  locale={locale}
                  layout="inline"
                  inheritColor
                />
              </strong>
            </DetailRow>
            <DetailRow>
              <span>{t("labels.unrealizedPl")}</span>
              <StrongNegative dir="ltr">
                {formatPercent(position.unrealizedPlPercent, {
                  locale,
                  decimals: 1,
                })}
              </StrongNegative>
            </DetailRow>
          </>
        ) : null}
      </Details>

      <List>
        {listKeys.map((key) => (
          <ListItem key={key} $tone={isReplacement ? "positive" : "negative"}>
            {isReplacement ? (
              <CheckCircle2 size={16} strokeWidth={2} aria-hidden />
            ) : (
              <CircleAlert size={16} strokeWidth={2} aria-hidden />
            )}
            <span>{t(getSmartReplaceTranslationKey(key))}</span>
          </ListItem>
        ))}
      </List>

      {isPreviewActive && isReplacement && onApplySwap ? (
        <ActionPillButton
          type="button"
          $tone={mapSuggestedActionToTone(suggestedAction)}
          onClick={onApplySwap}
        >
          {t("actions.applySwap")}
        </ActionPillButton>
      ) : (
        <ActionPill $tone={mapSuggestedActionToTone(suggestedAction)}>
          {isReplacement ? t("actions.buy") : t(`actions.${suggestedAction}`)}
        </ActionPill>
      )}
    </Card>
  );
};

const toneStyles = {
  positive: css`
    color: ${({ theme }) => theme.colors.status.positive};
    background: ${({ theme }) => theme.colors.status.positiveSoft};
  `,
  negative: css`
    color: ${({ theme }) => theme.colors.status.negative};
    background: ${({ theme }) => theme.colors.status.negativeSoft};
  `,
  neutral: css`
    color: ${({ theme }) => theme.colors.brand.primary};
    background: ${({ theme }) => theme.colors.brand.primarySoft};
  `,
  warning: css`
    color: ${({ theme }) => theme.colors.status.warning};
    background: ${({ theme }) => theme.colors.status.warningSoft};
  `,
};

const Card = styled(motion.article)<{
  $variant: "current" | "replacement";
  $preview: boolean;
}>`
  flex: 1;
  min-inline-size: 0;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.lg};
  border-radius: ${({ theme }) => theme.radius.lg};
  border: 1px solid
    ${({ theme, $preview, $variant }) =>
      $preview && $variant === "replacement"
        ? theme.colors.status.positive
        : $preview
          ? theme.colors.brand.primary
          : theme.colors.border.subtle};
  background: ${({ theme, $preview, $variant }) =>
      $preview
        ? `linear-gradient(135deg, color-mix(in srgb, ${
            $variant === "replacement"
              ? theme.colors.status.positive
              : theme.colors.brand.primary
          } 7%, transparent), transparent),`
        : ""}
    ${({ theme }) => theme.colors.background.card};
  box-shadow: ${({ theme }) => theme.colors.shadow.soft};
  transition:
    border-color 0.28s cubic-bezier(0.22, 1, 0.36, 1),
    box-shadow 0.28s cubic-bezier(0.22, 1, 0.36, 1),
    transform 0.28s cubic-bezier(0.22, 1, 0.36, 1);
`;

const Header = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.md};

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet - 1}px) {
    align-items: flex-start;
  }
`;

const StockIdentity = styled.div`
  min-inline-size: 0;
  display: flex;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.md};
`;

const StockCopy = styled.div`
  min-inline-size: 0;
`;

const Symbol = styled.strong`
  display: block;
  max-inline-size: 100%;
  overflow: hidden;
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.preset.cardTitle.fontSize};
  font-weight: ${({ theme }) => theme.typography.weight.bold};
  line-height: ${({ theme }) => theme.typography.lineHeight.tight};
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const Company = styled.span`
  display: block;
  max-inline-size: 100%;
  overflow: hidden;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.size.xs};
  font-weight: ${({ theme }) => theme.typography.weight.medium};
  line-height: ${({ theme }) => theme.typography.lineHeight.tight};
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const actionPillStyles = css<{ $tone: SmartReplaceTone }>`
  margin-block-start: auto;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-inline-size: 6.25rem;
  min-block-size: 2.35rem;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.lg};
  border-radius: ${({ theme }) => theme.radius.md};
  font-size: ${({ theme }) => theme.typography.preset.body.fontSize};
  font-weight: ${({ theme }) => theme.typography.weight.bold};
  line-height: ${({ theme }) => theme.typography.lineHeight.tight};
  box-shadow: ${({ theme }) => theme.colors.shadow.soft};
  transition:
    transform 0.22s cubic-bezier(0.22, 1, 0.36, 1),
    box-shadow 0.22s cubic-bezier(0.22, 1, 0.36, 1),
    filter 0.22s cubic-bezier(0.22, 1, 0.36, 1);
  ${({ $tone }: { $tone: SmartReplaceTone }) => toneStyles[$tone]}
`;

const ActionPill = styled.span<{ $tone: SmartReplaceTone }>`
  ${actionPillStyles}
  cursor: default;
`;

const ActionPillButton = styled.button<{ $tone: SmartReplaceTone }>`
  ${actionPillStyles}
  border: 0;
  cursor: pointer;

  @media (hover: hover) {
    &:hover {
      transform: translateY(-0.125rem) scale(1.03);
      box-shadow: ${({ theme }) => theme.colors.shadow.card};
      filter: saturate(1.08);
    }
  }
`;

const ActionRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const SectorBadge = styled(Badge)<{ $tone: SmartReplaceTone }>`
  ${({ $tone }: { $tone: SmartReplaceTone }) => toneStyles[$tone]}
`;

const Details = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const DetailRow = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.md};
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.size.xs};
  font-weight: ${({ theme }) => theme.typography.weight.medium};
  line-height: ${({ theme }) => theme.typography.lineHeight.tight};

  strong {
    color: ${({ theme }) => theme.colors.text.primary};
    font-weight: ${({ theme }) => theme.typography.weight.bold};
    text-align: end;
  }
`;

const StrongPositive = styled.strong`
  color: ${({ theme }) => theme.colors.status.positive} !important;
`;

const StrongNegative = styled.strong`
  color: ${({ theme }) => theme.colors.status.negative} !important;
`;

const List = styled.ul`
  display: grid;
  gap: ${({ theme }) => theme.spacing.sm};
  padding-block-start: ${({ theme }) => theme.spacing.sm};
  border-block-start: 1px solid ${({ theme }) => theme.colors.border.subtle};
`;

const ListItem = styled.li<{ $tone: SmartReplaceTone }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.size.xs};
  font-weight: ${({ theme }) => theme.typography.weight.medium};
  line-height: ${({ theme }) => theme.typography.preset.caption.lineHeight};

  svg {
    flex-shrink: 0;
    margin-block-start: ${({ theme }) => theme.spacing.xs};
    ${({ $tone }: { $tone: SmartReplaceTone }) => toneStyles[$tone]}
    background: transparent;
  }
`;
