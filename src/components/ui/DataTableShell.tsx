"use client";

import styled, { css } from "styled-components";
import { cardSurfaceOverflowHidden } from "@/lib/theme/cardSurface";

export const tableCellAlignment = css<{ $numeric?: boolean; $center?: boolean }>`
  text-align: ${({ $numeric, $center }) =>
    $center ? "center" : $numeric ? "end" : "start"};
`;

export const DataTableCard = styled.section`
  ${cardSurfaceOverflowHidden}
`;

export const DataTableHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.lg};
  border-block-end: 1px solid ${({ theme }) => theme.colors.border.subtle};

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet - 1}px) {
    align-items: flex-start;
    flex-direction: column;
  }
`;

export const DataTableTitle = styled.h2`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.preset.cardTitle.fontSize};
  font-weight: ${({ theme }) => theme.typography.preset.cardTitle.fontWeight};
  line-height: ${({ theme }) => theme.typography.preset.cardTitle.lineHeight};
`;

export const DataTableHeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  flex-wrap: wrap;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet - 1}px) {
    inline-size: 100%;
    justify-content: flex-start;
  }
`;

export const TableScroll = styled.div`
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;

  &::-webkit-scrollbar {
    block-size: 0.375rem;
  }

  &::-webkit-scrollbar-thumb {
    border-radius: ${({ theme }) => theme.radius.sm};
    background: ${({ theme }) => theme.colors.border.strong};
  }

  &::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.colors.background.app};
  }
`;

export const Table = styled.table<{ $minInlineSize?: string }>`
  inline-size: 100%;
  min-inline-size: ${({ $minInlineSize }) => $minInlineSize ?? "auto"};
  border-collapse: collapse;
`;

export const HeadCell = styled.th<{ $numeric?: boolean; $center?: boolean }>`
  padding: ${({ theme }) => theme.spacing.md};
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.size.xs};
  font-weight: ${({ theme }) => theme.typography.weight.medium};
  line-height: ${({ theme }) => theme.typography.lineHeight.normal};
  white-space: nowrap;
  ${tableCellAlignment}
`;

export const TableRow = styled.tr<{ $clickable?: boolean }>`
  border-block-start: 1px solid ${({ theme }) => theme.colors.border.subtle};
  min-block-size: 3rem;
  transition: background 0.16s ease;

  ${({ $clickable }) =>
    $clickable
      ? css`
          cursor: pointer;
        `
      : ""}

  &:hover {
    background: ${({ theme }) => theme.colors.background.soft};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.brand.primary};
    outline-offset: -2px;
  }
`;

export const Cell = styled.td<{ $numeric?: boolean; $center?: boolean; $wrap?: boolean }>`
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.preset.tableText.fontSize};
  font-weight: ${({ theme }) => theme.typography.preset.tableText.fontWeight};
  line-height: ${({ theme }) => theme.typography.preset.tableText.lineHeight};
  vertical-align: middle;
  white-space: ${({ $wrap }) => ($wrap ? "normal" : "nowrap")};
  ${tableCellAlignment}
`;

export const EllipsisText = styled.span`
  display: block;
  min-inline-size: 0;
  max-inline-size: 12rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;
