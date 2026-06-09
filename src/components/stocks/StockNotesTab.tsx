"use client";

import { useTranslations } from "next-intl";
import { motion, useReducedMotion } from "framer-motion";
import styled from "styled-components";
import { EmptyState } from "@/components/ui/EmptyState";
import type { StockAnalysisData } from "@/data/stocks/stock-analysis.types";
import { useAppData } from "@/providers/useAppData";
import { fadeUpVariants, getCardRevealTransition } from "@/utils/motion/transitions";
import { StockGeneralNotesList } from "./StockGeneralNotesList";
import { StockThesisNotesCard } from "./StockThesisNotesCard";

type StockNotesTabProps = {
  stock: StockAnalysisData;
};

export const StockNotesTab = ({ stock }: StockNotesTabProps) => {
  const t = useTranslations("stockAnalysis");
  const prefersReducedMotion = useReducedMotion();
  const { getStockGeneralNotes } = useAppData();

  const normalizedSymbol = stock.symbol.trim().toUpperCase();
  const generalNotes = getStockGeneralNotes(normalizedSymbol);

  const hasThesisKeys = Boolean(
    stock.thesisNotes?.whyIOwnItKey &&
      stock.thesisNotes?.whatToWatchKey &&
      stock.thesisNotes?.sellIfKey,
  );

  const hasContent = hasThesisKeys || generalNotes.length > 0;

  return (
    <TabPanel
      as={motion.div}
      initial={prefersReducedMotion ? false : "hidden"}
      animate="show"
      variants={fadeUpVariants}
      transition={getCardRevealTransition(0, prefersReducedMotion)}
    >
      {hasContent ? (
        <NotesStack>
          {hasThesisKeys && stock.thesisNotes ? (
            <StockThesisNotesCard symbol={stock.symbol} thesisNotes={stock.thesisNotes} />
          ) : null}
          <StockGeneralNotesList notes={generalNotes} />
        </NotesStack>
      ) : (
        <NotesEmptyCard>
          <EmptyState
            title={t("notes.emptyState")}
            description={t("notes.emptyDescription")}
          />
        </NotesEmptyCard>
      )}
    </TabPanel>
  );
};

const TabPanel = styled.div`
  max-inline-size: 48rem;
`;

const NotesStack = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
`;

const NotesEmptyCard = styled.section`
  padding: ${({ theme }) => theme.spacing.lg};
  background: ${({ theme }) => theme.colors.background.card};
  border: 1px solid ${({ theme }) => theme.colors.border.subtle};
  border-radius: ${({ theme }) => theme.radius.lg};
  box-shadow: ${({ theme }) => theme.colors.shadow.soft};
`;
