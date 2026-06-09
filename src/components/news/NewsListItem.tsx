"use client";

import type { KeyboardEvent } from "react";
import styled from "styled-components";
import type { NewsItem } from "@/data/news/news.types";
import { formatRelativePublishedAt } from "@/utils/news/formatRelativePublishedAt";
import { NewsImage } from "./NewsImage";
import { NewsSentimentBadge } from "./NewsSentimentBadge";
import { NewsSymbolChip } from "./NewsSymbolChip";

type NewsListItemProps = {
  item: NewsItem;
  locale: string;
  onOpen: (item: NewsItem) => void;
};

export const NewsListItem = ({ item, locale, onOpen }: NewsListItemProps) => {
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
    <Row
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
      />
      <Content>
        <Meta>
          <span>{item.source}</span>
          <MetaDivider aria-hidden>•</MetaDivider>
          <time dateTime={item.publishedAt}>
            {formatRelativePublishedAt(item.publishedAt, { locale })}
          </time>
        </Meta>
        <Title>{item.title}</Title>
        <Summary>{item.summary}</Summary>
        {item.relatedSymbols.length > 0 ? (
          <SymbolRow onClick={(event) => event.stopPropagation()}>
            {item.relatedSymbols.slice(0, 4).map((symbol) => (
              <NewsSymbolChip key={symbol} symbol={symbol} />
            ))}
          </SymbolRow>
        ) : null}
      </Content>
      <NewsSentimentBadge sentiment={item.sentiment} />
    </Row>
  );
};

const Row = styled.article`
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  align-items: start;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.border.subtle};
  border-radius: ${({ theme }) => theme.radius.lg};
  background: ${({ theme }) => theme.colors.background.card};
  box-shadow: ${({ theme }) => theme.colors.shadow.soft};
  cursor: pointer;
  min-inline-size: 0;
  transition: box-shadow 0.16s ease, border-color 0.16s ease;

  @media (hover: hover) {
    &:hover {
      box-shadow: ${({ theme }) => theme.colors.shadow.card};
      border-color: ${({ theme }) => theme.colors.border.strong};
    }
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet - 1}px) {
    grid-template-columns: auto minmax(0, 1fr);
    grid-template-areas:
      "image content"
      "sentiment sentiment";

    > :first-child {
      grid-area: image;
    }

    > :nth-child(2) {
      grid-area: content;
    }

    > :last-child {
      grid-area: sentiment;
      justify-self: start;
    }
  }
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
  min-inline-size: 0;
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

const Title = styled.h3`
  margin: 0;
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.preset.cardTitle.fontSize};
  font-weight: ${({ theme }) => theme.typography.preset.cardTitle.fontWeight};
  line-height: ${({ theme }) => theme.typography.preset.cardTitle.lineHeight};
`;

const Summary = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.preset.caption.fontSize};
  line-height: ${({ theme }) => theme.typography.lineHeight.relaxed};
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const SymbolRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.xs};
  margin-block-start: ${({ theme }) => theme.spacing.xs};
`;
