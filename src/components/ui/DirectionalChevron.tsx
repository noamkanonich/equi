"use client";

import { ChevronRight, type LucideProps } from "lucide-react";
import styled from "styled-components";

type DirectionalChevronProps = LucideProps;

export const DirectionalChevron = (props: DirectionalChevronProps) => {
  return <StyledChevron size={16} strokeWidth={1.9} aria-hidden {...props} />;
};

const StyledChevron = styled(ChevronRight)`
  flex-shrink: 0;

  html[dir="rtl"] & {
    transform: rotate(180deg);
  }
`;
