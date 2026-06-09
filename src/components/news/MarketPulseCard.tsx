"use client";

import { Minus, TrendingDown, TrendingUp, Zap } from "lucide-react";
import { useTranslations } from "next-intl";
import styled from "styled-components";
import type { MarketPulseItem } from "@/data/news/news.types";

type MarketPulseCardProps = {
  items: MarketPulseItem[];
};

const trendIconMap = {
  up: TrendingUp,
  down: TrendingDown,
  neutral: Minus,
} as const;

export const MarketPulseCard = ({ items }: MarketPulseCardProps) => {
  const t = useTranslations("news.marketPulse");

  return (
    <Card>
      <Header>
        <IconWrap aria-hidden>
          <Zap size={16} strokeWidth={1.9} />
        </IconWrap>
        <Title>{t("title")}</Title>
      </Header>
      <List>
        {items.map((item) => {
          const TrendIcon = trendIconMap[item.trend];
          return (
            <Row key={item.id}>
              <TrendDot $trend={item.trend} aria-hidden>
                <TrendIcon size={12} strokeWidth={2.2} />
              </TrendDot>
              <Text>{item.text}</Text>
            </Row>
          );
        })}
      </List>
    </Card>
  );
};

const Card = styled.section`
  padding: ${({ theme }) => theme.spacing.lg};
  border: 1px solid ${({ theme }) => theme.colors.border.subtle};
  border-radius: ${({ theme }) => theme.radius.lg};
  background: ${({ theme }) => theme.colors.background.card};
  box-shadow: ${({ theme }) => theme.colors.shadow.soft};
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-block-end: ${({ theme }) => theme.spacing.md};
`;

const IconWrap = styled.span`
  display: inline-flex;
  color: ${({ theme }) => theme.colors.brand.primary};
`;

const Title = styled.h2`
  margin: 0;
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.preset.cardTitle.fontSize};
  font-weight: ${({ theme }) => theme.typography.preset.cardTitle.fontWeight};
  line-height: ${({ theme }) => theme.typography.preset.cardTitle.lineHeight};
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
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const TrendDot = styled.span<{ $trend: MarketPulseItem["trend"] }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  inline-size: 1.25rem;
  block-size: 1.25rem;
  border-radius: 999px;
  flex-shrink: 0;
  margin-block-start: 0.125rem;
  color: ${({ theme, $trend }) =>
    $trend === "up"
      ? theme.colors.status.positive
      : $trend === "down"
        ? theme.colors.status.negative
        : theme.colors.status.neutral};
  background: ${({ theme, $trend }) =>
    $trend === "up"
      ? theme.colors.status.positiveSoft
      : $trend === "down"
        ? theme.colors.status.negativeSoft
        : theme.colors.status.neutralSoft};
`;

const Text = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.preset.caption.fontSize};
  line-height: ${({ theme }) => theme.typography.lineHeight.relaxed};
`;
