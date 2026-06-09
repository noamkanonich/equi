"use client";

import { Briefcase, LogOut, Settings } from "lucide-react";
import { useTranslations } from "next-intl";
import styled from "styled-components";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useRouter } from "@/i18n/routing";
import { useAuth } from "@/providers/useAuth";

export const ProfileQuickActionsCard = () => {
  const t = useTranslations("profile");
  const router = useRouter();
  const { signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <Card $interactive={false}>
      <Title>{t("quickActions")}</Title>
      <Actions>
        <ActionButton $variant="secondary" type="button" onClick={() => router.push("/portfolio")}>
          <Briefcase size={16} strokeWidth={1.75} aria-hidden />
          {t("goToPortfolio")}
        </ActionButton>
        <ActionButton $variant="secondary" type="button" onClick={() => router.push("/settings")}>
          <Settings size={16} strokeWidth={1.75} aria-hidden />
          {t("goToSettings")}
        </ActionButton>
        <ActionButton $variant="ghost" type="button" onClick={handleSignOut}>
          <LogOut size={16} strokeWidth={1.75} aria-hidden />
          {t("signOut")}
        </ActionButton>
      </Actions>
    </Card>
  );
};

const Title = styled.h3`
  margin: 0 0 ${({ theme }) => theme.spacing.md};
  font-size: ${({ theme }) => theme.typography.preset.cardTitle.fontSize};
  font-weight: ${({ theme }) => theme.typography.preset.cardTitle.fontWeight};
  color: ${({ theme }) => theme.colors.text.primary};
`;

const Actions = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const ActionButton = styled(Button)`
  justify-content: flex-start;
  inline-size: 100%;
`;
