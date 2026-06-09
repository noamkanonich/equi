"use client";

import styled from "styled-components";
import { Card } from "@/components/ui/Card";

export const PreviewCard = styled(Card)<{ $radius: string }>`
  border-radius: ${({ $radius }) => $radius};
  box-shadow: none;

  &:hover {
    box-shadow: none;
  }
`;

export const CardTitle = styled.h4`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.preset.body.fontSize};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
  line-height: ${({ theme }) => theme.typography.preset.body.lineHeight};
`;

export const ChartSpacer = styled.div`
  block-size: ${({ theme }) => theme.spacing.sm};
`;
