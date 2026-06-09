"use client";

import styled from "styled-components";
import { SkeletonBlock, SkeletonCircle } from "./skeletonBase";

export type SkeletonTableProps = {
  $rows?: number;
  $columns?: number;
  $showHeader?: boolean;
};

export const SkeletonTable = ({
  $rows = 5,
  $columns = 6,
  $showHeader = true,
}: SkeletonTableProps) => {
  return (
    <Wrap aria-hidden>
      {$showHeader ? (
        <HeaderRow $columns={$columns}>
          {Array.from({ length: $columns }, (_, index) => (
            <HeaderCell key={index}>
              <SkeletonBlock $height="0.625rem" $width={index === 0 ? "70%" : "55%"} />
            </HeaderCell>
          ))}
        </HeaderRow>
      ) : null}
      <Body>
        {Array.from({ length: $rows }, (_, rowIndex) => (
          <Row key={rowIndex} $columns={$columns}>
            {Array.from({ length: $columns }, (__, colIndex) => (
              <Cell key={colIndex}>
                {colIndex === 0 ? (
                  <FirstCell>
                    <SkeletonCircle $size="1.75rem" />
                    <SkeletonBlock $height="0.75rem" />
                  </FirstCell>
                ) : (
                  <SkeletonBlock
                    $height="0.75rem"
                    $width={colIndex % 2 === 0 ? "75%" : "55%"}
                  />
                )}
              </Cell>
            ))}
          </Row>
        ))}
      </Body>
    </Wrap>
  );
};

const Wrap = styled.div`
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  min-inline-size: 0;
`;

const HeaderRow = styled.div<{ $columns: number }>`
  display: grid;
  grid-template-columns: repeat(${({ $columns }) => $columns}, minmax(5rem, 1fr));
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.md};
  border-block-end: 1px solid ${({ theme }) => theme.colors.border.subtle};
  min-inline-size: 40rem;
`;

const HeaderCell = styled.div`
  min-inline-size: 0;
`;

const Body = styled.div`
  display: flex;
  flex-direction: column;
`;

const Row = styled.div<{ $columns: number }>`
  display: grid;
  grid-template-columns: repeat(${({ $columns }) => $columns}, minmax(5rem, 1fr));
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.md};
  border-block-end: 1px solid ${({ theme }) => theme.colors.border.subtle};
  min-inline-size: 40rem;

  &:last-child {
    border-block-end: none;
  }
`;

const Cell = styled.div`
  display: flex;
  align-items: center;
  min-inline-size: 0;
`;

const FirstCell = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  inline-size: 100%;
  min-inline-size: 0;
`;
