"use client";

import { Briefcase } from "lucide-react";
import { useTranslations } from "next-intl";
import styled from "styled-components";
import type { NewsItem, PortfolioNewsItem } from "@/data/news/news.types";
import { formatRelativePublishedAt } from "@/utils/news/formatRelativePublishedAt";

type PortfolioNewsCardProps = {
  items: PortfolioNewsItem[];
  locale: string;
  onViewAll: () => void;
  onOpenItem: (newsItemId: string) => void;
  onOpenStock: (symbol: string) => void;
  newsById: Record<string, NewsItem>;
};

export const PortfolioNewsCard = ({
  items,
  locale,
  onViewAll,
  onOpenItem,
  onOpenStock,
  newsById,
}: PortfolioNewsCardProps) => {
  const t = useTranslations("news.portfolioNews");

  const handleRowClick = (item: PortfolioNewsItem) => {
    if (item.newsItemId && newsById[item.newsItemId]) {
      onOpenItem(item.newsItemId);
      return;
    }
    onOpenStock(item.symbol);
  };

  return (
    <Card>
      <Header>
        <TitleGroup>
          <IconWrap aria-hidden>
            <Briefcase size={16} strokeWidth={1.9} />
          </IconWrap>
          <Title>{t("title")}</Title>
        </TitleGroup>
        <ViewButton type="button" onClick={onViewAll}>
          {t("viewAll")}
        </ViewButton>
      </Header>
      <List>
        {items.map((item) => (
          <Row key={item.id} type="button" onClick={() => handleRowClick(item)}>
            <Symbol dir="ltr">{item.symbol}</Symbol>
            <Copy>
              <Headline>{item.headline}</Headline>
              <Time dateTime={item.publishedAt}>
                {formatRelativePublishedAt(item.publishedAt, { locale })}
              </Time>
            </Copy>
          </Row>
        ))}
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
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-block-end: ${({ theme }) => theme.spacing.md};
`;

const TitleGroup = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  min-inline-size: 0;
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

const ViewButton = styled.button`
  padding: 0;
  border: 0;
  background: transparent;
  color: ${({ theme }) => theme.colors.brand.primary};
  font-size: ${({ theme }) => theme.typography.preset.caption.fontSize};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
  cursor: pointer;
  flex-shrink: 0;

  &:hover {
    text-decoration: underline;
  }
`;

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const Row = styled.button`
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  gap: ${({ theme }) => theme.spacing.sm};
  padding: 0;
  border: 0;
  background: transparent;
  cursor: pointer;
  text-align: start;
  min-inline-size: 0;

  &:hover p {
    color: ${({ theme }) => theme.colors.brand.primary};
  }
`;

const Symbol = styled.span`
  color: ${({ theme }) => theme.colors.brand.primary};
  font-size: ${({ theme }) => theme.typography.preset.caption.fontSize};
  font-weight: ${({ theme }) => theme.typography.weight.bold};
  flex-shrink: 0;
`;

const Copy = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
  min-inline-size: 0;
`;

const Headline = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.preset.caption.fontSize};
  font-weight: ${({ theme }) => theme.typography.weight.medium};
  line-height: ${({ theme }) => theme.typography.lineHeight.normal};
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const Time = styled.time`
  color: ${({ theme }) => theme.colors.text.muted};
  font-size: ${({ theme }) => theme.typography.size.xs};
`;
