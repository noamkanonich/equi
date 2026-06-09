"use client";

import { useLocale, useTranslations } from "next-intl";
import styled from "styled-components";
import { Card } from "@/components/ui/Card";
import type { AuthUser } from "@/data/auth/auth.types";
import { formatDate } from "@/utils/formatting/formatDate";
import { shortenUserId } from "@/utils/auth/shortenUserId";

type ProfileAccountCardProps = {
  user: AuthUser;
  isAuthenticated: boolean;
};

export const ProfileAccountCard = ({ user, isAuthenticated }: ProfileAccountCardProps) => {
  const t = useTranslations("profile");
  const locale = useLocale();

  return (
    <Card $interactive={false}>
      <Title>{t("accountDetails")}</Title>
      <Rows>
        <Row>
          <Label>{t("email")}</Label>
          <Value>{user.email}</Value>
        </Row>
        <Row>
          <Label>{t("userId")}</Label>
          <Value>{shortenUserId(user.id)}</Value>
        </Row>
        <Row>
          <Label>{t("provider")}</Label>
          <Value>{t("providerEmail")}</Value>
        </Row>
        <Row>
          <Label>{t("lastSignIn")}</Label>
          <Value>
            {user.lastSignInAt
              ? formatDate(user.lastSignInAt, { locale })
              : t("notAvailable")}
          </Value>
        </Row>
        <Row>
          <Label>{t("authenticated")}</Label>
          <Value>{isAuthenticated ? t("yes") : t("no")}</Value>
        </Row>
      </Rows>
    </Card>
  );
};

const Title = styled.h3`
  margin: 0 0 ${({ theme }) => theme.spacing.md};
  font-size: ${({ theme }) => theme.typography.preset.cardTitle.fontSize};
  font-weight: ${({ theme }) => theme.typography.preset.cardTitle.fontWeight};
  color: ${({ theme }) => theme.colors.text.primary};
`;

const Rows = styled.dl`
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 10rem) minmax(0, 1fr);
  gap: ${({ theme }) => theme.spacing.md};
  align-items: baseline;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet - 1}px) {
    grid-template-columns: 1fr;
    gap: ${({ theme }) => theme.spacing.xs};
  }
`;

const Label = styled.dt`
  margin: 0;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.preset.caption.fontSize};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
`;

const Value = styled.dd`
  margin: 0;
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.preset.body.fontSize};
  word-break: break-all;
`;
