"use client";

import { Pencil } from "lucide-react";
import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import styled from "styled-components";
import type { StockThesisNotes } from "@/data/stocks/stock-analysis.types";
import { useAppData } from "@/providers/useAppData";
import { StockNoteModal } from "./StockNoteModal";

type StockThesisNotesCardProps = {
  symbol: string;
  thesisNotes: StockThesisNotes;
};

export const StockThesisNotesCard = ({ symbol, thesisNotes }: StockThesisNotesCardProps) => {
  const t = useTranslations("stockAnalysis");
  const { getStockThesis, setStockThesis } = useAppData();
  const [isNoteOpen, setIsNoteOpen] = useState(false);

  const normalizedSymbol = symbol.trim().toUpperCase();
  const savedThesis = getStockThesis(normalizedSymbol);

  const sections = useMemo(
    () => [
      {
        key: "whyIOwnIt" as const,
        label: t("thesis.whyIOwnIt"),
        text: savedThesis?.whyIOwnIt?.trim()
          ? savedThesis.whyIOwnIt
          : t(thesisNotes.whyIOwnItKey),
      },
      {
        key: "whatToWatch" as const,
        label: t("thesis.whatToWatch"),
        text: savedThesis?.whatToWatch?.trim()
          ? savedThesis.whatToWatch
          : t(thesisNotes.whatToWatchKey),
      },
      {
        key: "sellIf" as const,
        label: t("thesis.sellIf"),
        text: savedThesis?.sellIf?.trim() ? savedThesis.sellIf : t(thesisNotes.sellIfKey),
      },
    ],
    [savedThesis, t, thesisNotes],
  );

  return (
    <>
      <Card>
        <Header>
          <Title>{t("thesis.title")}</Title>
          <EditButton type="button" onClick={() => setIsNoteOpen(true)}>
            <Pencil size={14} strokeWidth={1.8} />
            {t("thesis.edit")}
          </EditButton>
        </Header>
        <SectionList>
          {sections.map((section) => (
            <Section key={section.key}>
              <SectionLabel>{section.label}</SectionLabel>
              <SectionCopy>{section.text}</SectionCopy>
            </Section>
          ))}
        </SectionList>
      </Card>

      <StockNoteModal
        isOpen={isNoteOpen}
        onClose={() => setIsNoteOpen(false)}
        symbol={normalizedSymbol}
        mode="thesis"
        initialThesis={
          savedThesis ?? {
            whyIOwnIt: t(thesisNotes.whyIOwnItKey),
            whatToWatch: t(thesisNotes.whatToWatchKey),
            sellIf: t(thesisNotes.sellIfKey),
          }
        }
        onSaved={({ thesis }) => {
          if (thesis) {
            setStockThesis(normalizedSymbol, thesis);
          }
        }}
      />
    </>
  );
};

const Card = styled.section`
  padding: ${({ theme }) => theme.spacing.lg};
  background: ${({ theme }) => theme.colors.background.card};
  border: 1px solid ${({ theme }) => theme.colors.border.subtle};
  border-radius: ${({ theme }) => theme.radius.lg};
  box-shadow: ${({ theme }) => theme.colors.shadow.soft};
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

const EditButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
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

const SectionList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const SectionLabel = styled.span`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.size.xs};
  font-weight: ${({ theme }) => theme.typography.weight.bold};
  line-height: ${({ theme }) => theme.typography.lineHeight.tight};
`;

const SectionCopy = styled.p`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.preset.caption.fontSize};
  line-height: ${({ theme }) => theme.typography.lineHeight.relaxed};
`;
