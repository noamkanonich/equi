"use client";

import { useTranslations } from "next-intl";
import styled from "styled-components";
import { Badge } from "@/components/ui/Badge";
import type { NewsSentiment } from "@/data/news/news.types";

type NewsSentimentBadgeProps = {
  sentiment: NewsSentiment;
};

const sentimentToneMap = {
  positive: "positive",
  neutral: "neutral",
  negative: "negative",
} as const;

export const NewsSentimentBadge = ({ sentiment }: NewsSentimentBadgeProps) => {
  const t = useTranslations("news.sentiment");

  return (
    <StyledBadge $tone={sentimentToneMap[sentiment]}>
      {t(sentiment)}
    </StyledBadge>
  );
};

const StyledBadge = styled(Badge)`
  white-space: nowrap;
  flex-shrink: 0;
`;
