"use client";

import { useLocale, useTranslations } from "next-intl";
import styled, { css } from "styled-components";
import { mapMarketSessionStatusTone } from "@/data/market/mappers";
import type { MarketSessionStatus } from "@/data/market/market.types";
import { useMarketSessionClock } from "@/hooks/useMarketSessionClock";

type MarketSessionReminderProps = {
  $variant?: "full" | "compact";
};

export const MarketSessionReminder = ({
  $variant = "full",
}: MarketSessionReminderProps) => {
  const locale = useLocale();
  const t = useTranslations("shell.marketCard");
  const clock = useMarketSessionClock(locale);
  const status = clock?.status ?? "closed";
  const countdown = clock?.countdown ?? "--:--:--";
  const targetKey = clock?.targetKind === "open" ? "opensIn" : "closesIn";
  const statusKey = status === "open" ? "statusOpen" : "statusClosed";

  if ($variant === "compact") {
    return (
      <CompactWrap
        aria-label={`${t(statusKey)}. ${t(targetKey)} ${countdown}`}
        title={`${t(statusKey)} · ${t(targetKey)} ${countdown}`}
      >
        <StatusDot $status={status} aria-hidden />
        <CompactText>
          <CompactLabel>{t(targetKey)}</CompactLabel>
          <CompactCountdown>{countdown}</CompactCountdown>
        </CompactText>
      </CompactWrap>
    );
  }

  return (
    <Card>
      <StatusRow>
        <StatusDot $status={status} aria-hidden />
        <StatusText $status={status}>{t(statusKey)}</StatusText>
      </StatusRow>
      <Label>{t(targetKey)}</Label>
      <Countdown>{countdown}</Countdown>
      <Timestamp>{t("timestamp", { time: clock?.timestamp ?? "--" })}</Timestamp>
    </Card>
  );
};

const getStatusStyles = ($status: MarketSessionStatus) => css`
  color: ${({ theme }) =>
    mapMarketSessionStatusTone($status) === "positive"
      ? theme.colors.status.positive
      : theme.colors.status.neutral};
`;

const getStatusDotStyles = ($status: MarketSessionStatus) => css`
  background: ${({ theme }) =>
    mapMarketSessionStatusTone($status) === "positive"
      ? theme.colors.status.positive
      : theme.colors.status.neutral};
  box-shadow: 0 0 0 3px
    ${({ theme }) =>
      mapMarketSessionStatusTone($status) === "positive"
        ? theme.colors.status.positiveSoft
        : theme.colors.status.neutralSoft};
`;

const Card = styled.div`
  border: 1px solid ${({ theme }) => theme.colors.border.subtle};
  border-radius: ${({ theme }) => theme.radius.lg};
  background: ${({ theme }) => theme.colors.background.elevated};
  box-shadow: ${({ theme }) => theme.colors.shadow.soft};
  padding: ${({ theme }) => theme.spacing.md};
`;

const StatusRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-block-end: ${({ theme }) => theme.spacing.sm};
`;

const StatusDot = styled.span<{ $status: MarketSessionStatus }>`
  inline-size: 0.625rem;
  block-size: 0.625rem;
  border-radius: 999px;
  flex-shrink: 0;
  ${({ $status }) => getStatusDotStyles($status)}
`;

const StatusText = styled.span<{ $status: MarketSessionStatus }>`
  font-size: ${({ theme }) => theme.typography.preset.caption.fontSize};
  font-weight: ${({ theme }) => theme.typography.weight.bold};
  ${({ $status }) => getStatusStyles($status)}
`;

const Label = styled.div`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.preset.caption.fontSize};
  font-weight: ${({ theme }) => theme.typography.weight.medium};
`;

const Countdown = styled.div`
  margin-block-start: ${({ theme }) => theme.spacing.xs};
  color: ${({ theme }) => theme.colors.text.primary};
  font-family: ${({ theme }) => theme.typography.fontFamily.mono};
  font-size: ${({ theme }) => theme.typography.preset.sectionTitle.fontSize};
  line-height: ${({ theme }) => theme.typography.lineHeight.tight};
  font-weight: ${({ theme }) => theme.typography.weight.bold};
  font-variant-numeric: tabular-nums;
`;

const Timestamp = styled.div`
  margin-block-start: ${({ theme }) => theme.spacing.md};
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.preset.caption.fontSize};
  line-height: ${({ theme }) => theme.typography.preset.caption.lineHeight};
  font-weight: ${({ theme }) => theme.typography.weight.medium};
`;

const CompactWrap = styled.div`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  min-block-size: 2.75rem;
  border: 1px solid ${({ theme }) => theme.colors.border.subtle};
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.colors.background.elevated};
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  box-shadow: ${({ theme }) => theme.colors.shadow.soft};
  color: ${({ theme }) => theme.colors.text.primary};

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet - 1}px) {
    display: none;
  }
`;

const CompactText = styled.span`
  display: flex;
  flex-direction: column;
  gap: 0.0625rem;
  min-inline-size: 0;
`;

const CompactLabel = styled.span`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.size.xs};
  font-weight: ${({ theme }) => theme.typography.weight.medium};
  line-height: ${({ theme }) => theme.typography.lineHeight.tight};
  white-space: nowrap;
`;

const CompactCountdown = styled.span`
  color: ${({ theme }) => theme.colors.text.primary};
  font-family: ${({ theme }) => theme.typography.fontFamily.mono};
  font-size: ${({ theme }) => theme.typography.preset.caption.fontSize};
  font-weight: ${({ theme }) => theme.typography.weight.bold};
  line-height: ${({ theme }) => theme.typography.lineHeight.tight};
  font-variant-numeric: tabular-nums;
  direction: ltr;
`;
