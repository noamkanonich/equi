"use client";

import type { KeyboardEvent } from "react";
import { useTranslations } from "next-intl";
import styled from "styled-components";
import { Badge } from "@/components/ui/Badge";
import type { NewsItem } from "@/data/news/news.types";
import { formatRelativePublishedAt } from "@/utils/news/formatRelativePublishedAt";
import { NewsImage } from "./NewsImage";
import { NewsSentimentBadge } from "./NewsSentimentBadge";
import { NewsSymbolChip } from "./NewsSymbolChip";

type FeaturedNewsCardProps = {
  item: NewsItem;
  locale: string;
  onOpen: (item: NewsItem) => void;
};

export const FeaturedNewsCard = ({ item, locale, onOpen }: FeaturedNewsCardProps) => {
  const t = useTranslations("news");

  const handleClick = () => {
    onOpen(item);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onOpen(item);
    }
  };

  return (
    <Card
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      aria-label={item.title}
    >
      <NewsImage
        alt={item.title}
        imageUrl={item.imageUrl}
        fallbackLabel={item.relatedSymbols[0]}
        $variant="featured"
      />
      <Content>
        <TopRow>
          <FeaturedBadge>{t("featured.badge")}</FeaturedBadge>
          <NewsSentimentBadge sentiment={item.sentiment} />
        </TopRow>
        <Title>{item.title}</Title>
        <Summary>{item.summary}</Summary>
        <Meta>
          <span>{item.source}</span>
          <MetaDivider aria-hidden>•</MetaDivider>
          <time dateTime={item.publishedAt}>
            {formatRelativePublishedAt(item.publishedAt, { locale })}
          </time>
        </Meta>
        {item.relatedSymbols.length > 0 ? (
          <SymbolRow onClick={(event) => event.stopPropagation()}>
            {item.relatedSymbols.map((symbol) => (
              <NewsSymbolChip key={symbol} symbol={symbol} />
            ))}
          </SymbolRow>
        ) : null}
      </Content>
    </Card>
  );
};

const Card = styled.article`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.lg};
  border: 1px solid ${({ theme }) => theme.colors.border.subtle};
  border-radius: ${({ theme }) => theme.radius.xl};
  background: ${({ theme }) => theme.colors.background.card};
  box-shadow: ${({ theme }) => theme.colors.shadow.soft};
  cursor: pointer;
  min-inline-size: 0;
  transition: box-shadow 0.16s ease, border-color 0.16s ease;

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}px) {
    flex-direction: row;
    align-items: stretch;
  }

  @media (hover: hover) {
    &:hover {
      box-shadow: ${({ theme }) => theme.colors.shadow.card};
      border-color: ${({ theme }) => theme.colors.border.strong};
    }
  }
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
  min-inline-size: 0;
  flex: 1;
`;

const TopRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.sm};
  flex-wrap: wrap;
`;

const FeaturedBadge = styled(Badge)`
  background: ${({ theme }) => theme.colors.brand.primarySoft};
  color: ${({ theme }) => theme.colors.brand.primary};
`;

const Title = styled.h2`
  margin: 0;
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.preset.sectionTitle.fontSize};
  font-weight: ${({ theme }) => theme.typography.preset.sectionTitle.fontWeight};
  line-height: ${({ theme }) => theme.typography.preset.sectionTitle.lineHeight};
`;

const Summary = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.preset.body.fontSize};
  line-height: ${({ theme }) => theme.typography.lineHeight.relaxed};
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const Meta = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.xs};
  color: ${({ theme }) => theme.colors.text.muted};
  font-size: ${({ theme }) => theme.typography.size.xs};
`;

const MetaDivider = styled.span``;

const SymbolRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.xs};
  margin-block-start: ${({ theme }) => theme.spacing.xs};
`;
