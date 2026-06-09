"use client";

import { ChevronDown, Star } from "lucide-react";
import { useTranslations } from "next-intl";
import styled from "styled-components";
import { Button } from "@/components/ui/Button";

export const StockActionButtons = () => {
  const t = useTranslations("stockAnalysis.actions");

  return (
    <Wrapper>
      <Button $variant="secondary" $size="sm" onClick={() => undefined}>
        <Star size={16} strokeWidth={1.8} />
        {t("addToWatchlist")}
      </Button>
      <Button $variant="primary" $size="sm" onClick={() => undefined}>
        {t("addToPortfolio")}
        <ChevronDown size={16} strokeWidth={1.8} />
      </Button>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.sm};

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet - 1}px) {
    justify-content: stretch;

    button {
      flex: 1;
      min-inline-size: 0;
    }
  }
`;
