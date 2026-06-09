"use client";

import { Info } from "lucide-react";
import { useTranslations } from "next-intl";
import styled from "styled-components";
import { chartCardHover } from "@/components/charts/chartCardChrome";
import { StaleDataNotice } from "@/components/ui/states/StaleDataNotice";
import { Link } from "@/i18n/routing";
import type { KeyStatisticItem } from "@/data/reports/reports.types";
import type { DataFreshnessStatus } from "@/data/ui/ui-state.types";

type KeyStatisticsCardProps = {
  statistics: KeyStatisticItem[];
  freshnessStatus: DataFreshnessStatus;
};

export const KeyStatisticsCard = ({
  statistics,
  freshnessStatus,
}: KeyStatisticsCardProps) => {
  const t = useTranslations("reports.statistics");
  const tStates = useTranslations("states");
  const showStaleNotice =
    freshnessStatus === "mock" || freshnessStatus === "stale";

  return (
    <Card>
      <Title>{t("title")}</Title>
      {showStaleNotice ? (
        <NoticeWrap>
          <StaleDataNotice
            title={tStates("stale.title")}
            description={tStates("stale.description")}
          />
        </NoticeWrap>
      ) : null}
      <List>
        {statistics.map((item) => (
          <Row key={item.key}>
            <Label>
              {t(item.key)}
              <InfoIcon size={14} strokeWidth={1.8} aria-hidden />
            </Label>
            {item.symbol ? (
              <ValueLink href={`/stocks/${item.symbol}`} dir="ltr">
                {item.value}
              </ValueLink>
            ) : (
              <Value dir="ltr">{item.value}</Value>
            )}
          </Row>
        ))}
      </List>
    </Card>
  );
};

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

const NoticeWrap = styled.div`
  margin-block-end: ${({ theme }) => theme.spacing.xs};
`;

const List = styled.ul`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
  margin: 0;
  padding: 0;
  list-style: none;
`;

const Row = styled.li`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.md};
  padding-block: ${({ theme }) => theme.spacing.xs};
  border-block-end: 1px solid ${({ theme }) => theme.colors.border.subtle};

  &:last-child {
    border-block-end: none;
  }
`;

const Label = styled.span`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.preset.caption.fontSize};
`;

const InfoIcon = styled(Info)`
  color: ${({ theme }) => theme.colors.text.muted};
  flex-shrink: 0;
`;

const Value = styled.span`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.preset.body.fontSize};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
`;

const ValueLink = styled(Link)`
  color: ${({ theme }) => theme.colors.brand.primary};
  font-size: ${({ theme }) => theme.typography.preset.body.fontSize};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;
