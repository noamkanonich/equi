"use client";

import { useTranslations } from "next-intl";
import styled, { css } from "styled-components";
import { EmptyState } from "@/components/ui/EmptyState";
import type { StockNewsCategory, StockNewsItem } from "@/data/stocks/stock-analysis.types";

type StockLatestNewsCardProps = {
  news: StockNewsItem[];
  onViewAll?: () => void;
};

const categoryStyles: Record<
  StockNewsCategory,
  ReturnType<typeof css>
> = {
  earnings: css`
    color: ${({ theme }) => theme.colors.status.positive};
    background: ${({ theme }) => theme.colors.status.positiveSoft};
  `,
  analysis: css`
    color: ${({ theme }) => theme.colors.brand.primary};
    background: ${({ theme }) => theme.colors.brand.primarySoft};
  `,
  news: css`
    color: ${({ theme }) => theme.colors.chart.purple};
    background: ${({ theme }) => theme.colors.background.soft};
  `,
};

export const StockLatestNewsCard = ({ news, onViewAll }: StockLatestNewsCardProps) => {
  const t = useTranslations("stockAnalysis");
  const newsItems = news ?? [];

  return (
    <Card>
      <Header>
        <Title>{t("news.title")}</Title>
        {newsItems.length > 0 ? (
          <ViewAll type="button" onClick={onViewAll}>
            {t("news.viewAll")}
          </ViewAll>
        ) : null}
      </Header>
      {newsItems.length === 0 ? (
        <EmptyState
          title={t("news.emptyState")}
          description={t("news.emptyDescription")}
        />
      ) : null}
      <List>
        {newsItems.map((item) => (
          <NewsRow key={item.id}>
            <NewsContent>
              <NewsTitle>{t(item.titleKey)}</NewsTitle>
              <NewsMeta>
                {t(item.sourceKey)} • {t(item.timeAgoKey)}
              </NewsMeta>
            </NewsContent>
            <CategoryBadge $category={item.category}>
              {t(`news.categories.${item.category}`)}
            </CategoryBadge>
          </NewsRow>
        ))}
      </List>
    </Card>
  );
};

const Card = styled.section`
  padding: ${({ theme }) => theme.spacing.lg};
  background: ${({ theme }) => theme.colors.background.card};
  border: 1px solid ${({ theme }) => theme.colors.border.subtle};
  border-radius: ${({ theme }) => theme.radius.lg};
  box-shadow: ${({ theme }) => theme.colors.shadow.soft};
  block-size: 100%;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.md};
  margin-block-end: ${({ theme }) => theme.spacing.md};
`;

const Title = styled.h2`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.preset.cardTitle.fontSize};
  font-weight: ${({ theme }) => theme.typography.preset.cardTitle.fontWeight};
  line-height: ${({ theme }) => theme.typography.preset.cardTitle.lineHeight};
`;

const ViewAll = styled.button`
  padding: 0;
  border: 0;
  background: transparent;
  color: ${({ theme }) => theme.colors.brand.primary};
  font-size: ${({ theme }) => theme.typography.preset.caption.fontSize};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`;

const List = styled.ul`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  margin: 0;
  padding: 0;
  list-style: none;
`;

const NewsRow = styled.li`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.md};
  padding-block-end: ${({ theme }) => theme.spacing.md};
  border-block-end: 1px solid ${({ theme }) => theme.colors.border.subtle};

  &:last-child {
    padding-block-end: 0;
    border-block-end: 0;
  }
`;

const NewsContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
  min-inline-size: 0;
`;

const NewsTitle = styled.p`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.preset.caption.fontSize};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
  line-height: ${({ theme }) => theme.typography.lineHeight.relaxed};
`;

const NewsMeta = styled.span`
  color: ${({ theme }) => theme.colors.text.muted};
  font-size: ${({ theme }) => theme.typography.size.xs};
  line-height: ${({ theme }) => theme.typography.lineHeight.normal};
`;

const CategoryBadge = styled.span<{ $category: StockNewsCategory }>`
  flex-shrink: 0;
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.radius.sm};
  font-size: ${({ theme }) => theme.typography.size.xs};
  font-weight: ${({ theme }) => theme.typography.weight.bold};
  white-space: nowrap;
  ${({ $category }) => categoryStyles[$category]}
`;
