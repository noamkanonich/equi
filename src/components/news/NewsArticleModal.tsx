"use client";

import { useTranslations } from "next-intl";
import styled from "styled-components";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import type { NewsItem } from "@/data/news/news.types";
import { formatRelativePublishedAt } from "@/utils/news/formatRelativePublishedAt";
import { NewsSentimentBadge } from "./NewsSentimentBadge";
import { NewsSymbolChip } from "./NewsSymbolChip";

type NewsArticleModalProps = {
  item: NewsItem | null;
  locale: string;
  isOpen: boolean;
  onClose: () => void;
};

export const NewsArticleModal = ({
  item,
  locale,
  isOpen,
  onClose,
}: NewsArticleModalProps) => {
  const t = useTranslations("news");

  if (!item) {
    return null;
  }

  const handleOpenArticle = () => {
    if (item.url) {
      window.open(item.url, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      labelledBy="news-article-modal-title"
      describedBy="news-article-modal-summary"
    >
      <Panel>
        <Header>
          <Title id="news-article-modal-title">{item.title}</Title>
          <CloseButton type="button" onClick={onClose}>
            {t("modal.close")}
          </CloseButton>
        </Header>
        <Meta>
          <span>{item.source}</span>
          <MetaDivider aria-hidden>•</MetaDivider>
          <time dateTime={item.publishedAt}>
            {formatRelativePublishedAt(item.publishedAt, { locale })}
          </time>
        </Meta>
        <BadgeRow>
          <NewsSentimentBadge sentiment={item.sentiment} />
        </BadgeRow>
        <Summary id="news-article-modal-summary">{item.summary}</Summary>
        {item.relatedSymbols.length > 0 ? (
          <SymbolRow>
            {item.relatedSymbols.map((symbol) => (
              <NewsSymbolChip key={symbol} symbol={symbol} />
            ))}
          </SymbolRow>
        ) : null}
        {item.url ? (
          <Actions>
            <Button type="button" onClick={handleOpenArticle}>
              {t("openArticle")}
            </Button>
          </Actions>
        ) : null}
      </Panel>
    </Modal>
  );
};

const Panel = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
  max-inline-size: 36rem;
  inline-size: 100%;
`;

const Header = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.md};
  margin-block-end: ${({ theme }) => theme.spacing.sm};
`;

const Title = styled.h2`
  margin: 0;
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.preset.sectionTitle.fontSize};
  font-weight: ${({ theme }) => theme.typography.preset.sectionTitle.fontWeight};
  line-height: ${({ theme }) => theme.typography.preset.sectionTitle.lineHeight};
`;

const CloseButton = styled.button`
  padding: 0;
  border: 0;
  background: transparent;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.preset.caption.fontSize};
  cursor: pointer;
  flex-shrink: 0;

  &:hover {
    color: ${({ theme }) => theme.colors.brand.primary};
  }
`;

const Meta = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.xs};
  color: ${({ theme }) => theme.colors.text.muted};
  font-size: ${({ theme }) => theme.typography.size.xs};
  margin-block-end: ${({ theme }) => theme.spacing.sm};
`;

const MetaDivider = styled.span``;

const BadgeRow = styled.div`
  margin-block-end: ${({ theme }) => theme.spacing.md};
`;

const Summary = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.preset.body.fontSize};
  line-height: ${({ theme }) => theme.typography.lineHeight.relaxed};
`;

const SymbolRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.xs};
  margin-block-start: ${({ theme }) => theme.spacing.md};
`;

const Actions = styled.div`
  margin-block-start: ${({ theme }) => theme.spacing.lg};
`;
