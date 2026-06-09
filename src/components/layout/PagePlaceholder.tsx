"use client";

import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import styled from "styled-components";

export type PagePlaceholderProps = {
  title: string;
  subtitle?: string;
  emptyMessage: string;
};

export const PagePlaceholder = ({
  title,
  subtitle,
  emptyMessage,
}: PagePlaceholderProps) => {
  return (
    <Wrapper>
      <PageHeader>
        <Title>{title}</Title>
        {subtitle ? <Subtitle>{subtitle}</Subtitle> : null}
      </PageHeader>
      <Card>
        <EmptyState title={emptyMessage} />
      </Card>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
  max-width: 48rem;
`;

const PageHeader = styled.header`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const Title = styled.h1`
  font-size: ${({ theme }) => theme.typography.preset.pageTitle.fontSize};
  font-weight: ${({ theme }) => theme.typography.preset.pageTitle.fontWeight};
  line-height: ${({ theme }) => theme.typography.preset.pageTitle.lineHeight};
  color: ${({ theme }) => theme.colors.text.primary};
`;

const Subtitle = styled.p`
  font-size: ${({ theme }) => theme.typography.preset.body.fontSize};
  color: ${({ theme }) => theme.colors.text.secondary};
  line-height: ${({ theme }) => theme.typography.preset.body.lineHeight};
`;
