"use client";

import { ArrowDown, ArrowUp } from "lucide-react";
import { useTranslations } from "next-intl";
import styled, { css } from "styled-components";
import type { UpgradeDowngradeSignal } from "@/data/smart-replace/smart-replace.types";
import { getSmartReplaceTranslationKey } from "@/utils/smart-replace/getSmartReplaceTranslationKey";

type SmartReplaceSignalsCardProps = {
  signals: UpgradeDowngradeSignal[];
};

export const SmartReplaceSignalsCard = ({ signals }: SmartReplaceSignalsCardProps) => {
  const t = useTranslations("smartReplace");

  return (
    <Card>
      <Title>{t("sidebar.recentSignals")}</Title>
      <List>
        {signals.map((signal) => {
          const Icon = signal.type === "upgrade" ? ArrowUp : ArrowDown;

          return (
            <Row key={signal.id}>
              <SignalType $type={signal.type}>
                <Icon size={14} strokeWidth={2} aria-hidden />
                {t(`signals.${signal.type}`)}
              </SignalType>
              <Symbol dir="ltr">{signal.symbol}</Symbol>
              <Description>{t(getSmartReplaceTranslationKey(signal.descriptionKey))}</Description>
              <Age>{t(getSmartReplaceTranslationKey(signal.ageKey))}</Age>
            </Row>
          );
        })}
      </List>
    </Card>
  );
};

const Card = styled.section`
  display: grid;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.lg};
  background: ${({ theme }) => theme.colors.background.card};
  border: 1px solid ${({ theme }) => theme.colors.border.subtle};
  border-radius: ${({ theme }) => theme.radius.lg};
  box-shadow: ${({ theme }) => theme.colors.shadow.soft};
`;

const Title = styled.h2`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.preset.cardTitle.fontSize};
  font-weight: ${({ theme }) => theme.typography.preset.cardTitle.fontWeight};
  line-height: ${({ theme }) => theme.typography.preset.cardTitle.lineHeight};
`;

const List = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: auto auto minmax(0, 1fr) auto;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding-block: ${({ theme }) => theme.spacing.sm};
  border-block-start: 1px solid ${({ theme }) => theme.colors.border.subtle};

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet - 1}px) {
    grid-template-columns: auto auto minmax(0, 1fr);
  }
`;

const SignalType = styled.span<{ $type: UpgradeDowngradeSignal["type"] }>`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  font-size: ${({ theme }) => theme.typography.size.xs};
  font-weight: ${({ theme }) => theme.typography.weight.bold};
  line-height: ${({ theme }) => theme.typography.lineHeight.tight};
  ${({ $type }) =>
    $type === "upgrade"
      ? css`
          color: ${({ theme }) => theme.colors.status.positive};
        `
      : css`
          color: ${({ theme }) => theme.colors.status.negative};
        `}
`;

const Symbol = styled.strong`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.size.xs};
  font-weight: ${({ theme }) => theme.typography.weight.bold};
  line-height: ${({ theme }) => theme.typography.lineHeight.tight};
`;

const Description = styled.span`
  min-inline-size: 0;
  overflow: hidden;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.size.xs};
  font-weight: ${({ theme }) => theme.typography.weight.medium};
  line-height: ${({ theme }) => theme.typography.lineHeight.tight};
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const Age = styled.span`
  color: ${({ theme }) => theme.colors.text.muted};
  font-size: ${({ theme }) => theme.typography.size.xs};
  font-weight: ${({ theme }) => theme.typography.weight.medium};
  line-height: ${({ theme }) => theme.typography.lineHeight.tight};

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet - 1}px) {
    display: none;
  }
`;
