"use client";

import styled from "styled-components";

export const PageContent = styled.div`
  inline-size: 100%;
  max-inline-size: ${({ theme }) => theme.layout.pageMaxWidth};
  margin-inline: auto;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.layout.pageGap};
  padding-block-end: ${({ theme }) => theme.layout.pagePaddingBlockEnd};
  min-inline-size: 0;
`;

export const PageMainGrid = styled.section`
  display: grid;
  grid-template-columns: minmax(0, 1fr) ${({ theme }) => theme.layout.sidebarColumn};
  gap: ${({ theme }) => theme.layout.pageGap};
  align-items: stretch;
  min-inline-size: 0;

  @media (max-width: ${({ theme }) => theme.breakpoints.desktop - 1}px) {
    grid-template-columns: 1fr;
  }
`;

export const PageSplitWideGrid = styled.section`
  display: grid;
  grid-template-columns: ${({ theme }) => theme.layout.mainSplitWide};
  gap: ${({ theme }) => theme.layout.pageGapDense};
  align-items: stretch;
  min-inline-size: 0;

  @media (max-width: ${({ theme }) => theme.breakpoints.desktop - 1}px) {
    grid-template-columns: 1fr;
  }
`;

export const PageColumnStack = styled.div`
  min-inline-size: 0;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.layout.pageGap};
`;
