"use client";

import { useTranslations } from "next-intl";
import styled from "styled-components";
import type { StockGeneralNote } from "@/data/app-data/stock-notes.types";

type StockGeneralNotesListProps = {
  notes: StockGeneralNote[];
};

export const StockGeneralNotesList = ({ notes }: StockGeneralNotesListProps) => {
  const t = useTranslations("stockAnalysis.notes");

  if (notes.length === 0) {
    return null;
  }

  return (
    <Card>
      <Title>{t("generalNotesTitle")}</Title>
      <NoteList>
        {notes.map((note) => (
          <NoteItem key={note.id}>
            <NoteHeader>
              <NoteTitle>{note.title || t("untitledNote")}</NoteTitle>
              {note.category ? <NoteCategory>{note.category}</NoteCategory> : null}
            </NoteHeader>
            <NoteBody>{note.note}</NoteBody>
          </NoteItem>
        ))}
      </NoteList>
    </Card>
  );
};

const Card = styled.section`
  padding: ${({ theme }) => theme.spacing.lg};
  background: ${({ theme }) => theme.colors.background.card};
  border: 1px solid ${({ theme }) => theme.colors.border.subtle};
  border-radius: ${({ theme }) => theme.radius.lg};
  box-shadow: ${({ theme }) => theme.colors.shadow.soft};
`;

const Title = styled.h2`
  margin-block-end: ${({ theme }) => theme.spacing.md};
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.preset.cardTitle.fontSize};
  font-weight: ${({ theme }) => theme.typography.preset.cardTitle.fontWeight};
  line-height: ${({ theme }) => theme.typography.preset.cardTitle.lineHeight};
`;

const NoteList = styled.ul`
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

const NoteItem = styled.li`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
  padding-block-end: ${({ theme }) => theme.spacing.md};
  border-block-end: 1px solid ${({ theme }) => theme.colors.border.subtle};

  &:last-child {
    padding-block-end: 0;
    border-block-end: none;
  }
`;

const NoteHeader = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const NoteTitle = styled.span`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.preset.body.fontSize};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
`;

const NoteCategory = styled.span`
  padding-inline: ${({ theme }) => theme.spacing.sm};
  padding-block: 0.125rem;
  border-radius: ${({ theme }) => theme.radius.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
  background: ${({ theme }) => theme.colors.background.soft};
  font-size: ${({ theme }) => theme.typography.size.xs};
  text-transform: capitalize;
`;

const NoteBody = styled.p`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.preset.caption.fontSize};
  line-height: ${({ theme }) => theme.typography.lineHeight.relaxed};
  white-space: pre-wrap;
`;
