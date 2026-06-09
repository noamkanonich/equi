"use client";

import { motion, useReducedMotion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { useTranslations } from "next-intl";
import styled from "styled-components";
import { Button } from "@/components/ui/Button";
import type {
  AddStockDestination,
  AddStockSearchResult,
} from "@/data/add-stock/add-stock.types";

type AddStockSuccessVariant = "added" | "alreadyInWatchlist";

type AddStockSuccessStateProps = {
  stock: AddStockSearchResult;
  destination: AddStockDestination;
  variant?: AddStockSuccessVariant;
  onClose: () => void;
};

export const AddStockSuccessState = ({
  stock,
  destination,
  variant = "added",
  onClose,
}: AddStockSuccessStateProps) => {
  const t = useTranslations("addStock");
  const prefersReducedMotion = useReducedMotion();
  const messageKey =
    variant === "alreadyInWatchlist"
      ? "success.alreadyInWatchlistMessage"
      : destination === "portfolio"
        ? "success.addedToPortfolio"
        : "success.addedToWatchlist";
  const titleKey =
    variant === "alreadyInWatchlist" ? "success.alreadyInWatchlistTitle" : "success.title";

  return (
    <Wrapper
      initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: prefersReducedMotion ? 0 : 0.22, ease: "easeOut" }}
    >
      <IconWrap $variant={variant}>
        <CheckCircle2 size={34} strokeWidth={1.8} aria-hidden />
      </IconWrap>
      <Title>{t(titleKey)}</Title>
      <Message>{t(messageKey, { symbol: stock.symbol })}</Message>
      <Button onClick={onClose}>{t("success.done")}</Button>
    </Wrapper>
  );
};

const Wrapper = styled(motion.div)`
  display: flex;
  min-block-size: 28rem;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.xl};
  text-align: center;
`;

const IconWrap = styled.div<{ $variant: AddStockSuccessVariant }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  inline-size: 4rem;
  block-size: 4rem;
  border-radius: 50%;
  background: ${({ theme, $variant }) =>
    $variant === "alreadyInWatchlist"
      ? theme.colors.status.warningSoft
      : theme.colors.status.positiveSoft};
  color: ${({ theme, $variant }) =>
    $variant === "alreadyInWatchlist"
      ? theme.colors.status.warning
      : theme.colors.status.positive};
`;

const Title = styled.h3`
  margin: 0;
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.preset.sectionTitle.fontSize};
  font-weight: ${({ theme }) => theme.typography.preset.sectionTitle.fontWeight};
  line-height: ${({ theme }) => theme.typography.preset.sectionTitle.lineHeight};
`;

const Message = styled.p`
  margin: 0;
  max-inline-size: 24rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.preset.body.fontSize};
  line-height: ${({ theme }) => theme.typography.preset.body.lineHeight};
`;
