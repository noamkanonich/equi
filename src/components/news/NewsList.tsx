"use client";

import styled from "styled-components";
import type { NewsItem } from "@/data/news/news.types";
import { NewsListItem } from "./NewsListItem";

type NewsListProps = {
  items: NewsItem[];
  locale: string;
  onOpen: (item: NewsItem) => void;
};

export const NewsList = ({ items, locale, onOpen }: NewsListProps) => {
  return (
    <List>
      {items.map((item) => (
        <NewsListItem key={item.id} item={item} locale={locale} onOpen={onOpen} />
      ))}
    </List>
  );
};

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  min-inline-size: 0;
`;
