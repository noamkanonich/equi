"use client";

import styled from "styled-components";

type EquiMarkProps = {
  $size?: number;
  title?: string;
  decorative?: boolean;
};

export const EquiMark = ({
  $size = 24,
  title,
  decorative = true,
}: EquiMarkProps) => {
  const isStandalone = !decorative && Boolean(title);

  return (
    <MarkSvg
      $size={$size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role={isStandalone ? "img" : undefined}
      aria-hidden={decorative ? true : undefined}
      aria-label={isStandalone ? title : undefined}
    >
      {isStandalone ? <title>{title}</title> : null}
      <MarkLine x1="12" y1="4" x2="12" y2="20" />
      <MarkLine x1="5" y1="7" x2="19" y2="7" />
      <MarkLine x1="5" y1="17" x2="19" y2="17" />
    </MarkSvg>
  );
};

const MarkSvg = styled.svg<{ $size: number }>`
  display: block;
  width: ${({ $size }) => $size}px;
  height: ${({ $size }) => $size}px;
  flex-shrink: 0;
  color: ${({ theme }) => theme.colors.text.primary};
`;

const MarkLine = styled.line`
  stroke: currentColor;
  stroke-width: 1.75;
  stroke-linecap: round;
`;
