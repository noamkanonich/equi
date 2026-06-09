"use client";

import { useLocale, useTranslations } from "next-intl";
import styled from "styled-components";
import { Card } from "@/components/ui/Card";
import type { AuthUser } from "@/data/auth/auth.types";
import { isSupabaseConfigured } from "@/lib/supabase/supabase";
import { formatDate } from "@/utils/formatting/formatDate";
import { getEmailInitials } from "@/utils/auth/getEmailInitials";

type ProfileHeaderCardProps = {
  user: AuthUser;
  isAuthenticated: boolean;
};

export const ProfileHeaderCard = ({ user, isAuthenticated }: ProfileHeaderCardProps) => {
  const t = useTranslations("profile");
  const locale = useLocale();
  const initials = getEmailInitials(user.email);
  const isSynced = isSupabaseConfigured && isAuthenticated;

  return (
    <Card $interactive={false}>
      <Layout>
        <Avatar aria-hidden>{initials}</Avatar>
        <Copy>
          <Email>{user.email}</Email>
          <StatusRow>
            <StatusLabel>{t("accountStatus")}</StatusLabel>
            <StatusValue $synced={isSynced}>
              {isSynced ? t("synced") : t("localMode")}
            </StatusValue>
          </StatusRow>
          {user.createdAt ? (
            <MetaText>
              {t("joinedAt")}: {formatDate(user.createdAt, { locale })}
            </MetaText>
          ) : null}
        </Copy>
      </Layout>
    </Card>
  );
};

const Layout = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.lg};

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet - 1}px) {
    flex-direction: column;
    align-items: flex-start;
    gap: ${({ theme }) => theme.spacing.md};
  }
`;

const Avatar = styled.div`
  inline-size: 4rem;
  block-size: 4rem;
  border-radius: 50%;
  border: 1px solid ${({ theme }) => theme.colors.border.subtle};
  background: ${({ theme }) => theme.colors.brand.primarySoft};
  color: ${({ theme }) => theme.colors.brand.primary};
  font-size: ${({ theme }) => theme.typography.preset.sectionTitle.fontSize};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const Copy = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
  min-inline-size: 0;
`;

const Email = styled.h2`
  margin: 0;
  font-size: ${({ theme }) => theme.typography.preset.sectionTitle.fontSize};
  font-weight: ${({ theme }) => theme.typography.preset.sectionTitle.fontWeight};
  color: ${({ theme }) => theme.colors.text.primary};
  word-break: break-all;
`;

const StatusRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  flex-wrap: wrap;
`;

const StatusLabel = styled.span`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.preset.caption.fontSize};
`;

const StatusValue = styled.span<{ $synced: boolean }>`
  color: ${({ theme, $synced }) =>
    $synced ? theme.colors.status.positive : theme.colors.text.muted};
  font-size: ${({ theme }) => theme.typography.preset.caption.fontSize};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
`;

const MetaText = styled.span`
  color: ${({ theme }) => theme.colors.text.muted};
  font-size: ${({ theme }) => theme.typography.preset.caption.fontSize};
`;
