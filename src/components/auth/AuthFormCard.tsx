"use client";

import { useTranslations } from "next-intl";
import styled from "styled-components";
import { AuthForm } from "@/components/auth/AuthForm";
import { authCardReveal, authTabCrossfade } from "@/components/auth/authMotion";
import type { AuthMode } from "@/data/auth/auth.types";

type AuthFormCardProps = {
  mode: AuthMode;
  successMessage: string | null;
  onModeChange: (mode: AuthMode) => void;
  onSuccess?: () => void;
  onEmailConfirmationRequired: () => void;
  onClearSuccess: () => void;
};

export const AuthFormCard = ({
  mode,
  successMessage,
  onModeChange,
  onSuccess,
  onEmailConfirmationRequired,
  onClearSuccess,
}: AuthFormCardProps) => {
  const t = useTranslations("authWelcome");
  const tAuth = useTranslations("auth");

  return (
    <CardWrap>
      <Card>
        {successMessage ? (
          <SuccessState>
            <SuccessMessage role="status">{successMessage}</SuccessMessage>
            <SuccessAction type="button" onClick={onClearSuccess}>
              {tAuth("signIn")}
            </SuccessAction>
          </SuccessState>
        ) : (
          <>
            <CardHeader key={mode}>
              <CardTitle>{mode === "signIn" ? t("signInTitle") : t("signUpTitle")}</CardTitle>
              <CardDescription>
                {mode === "signIn" ? t("signInDescription") : t("signUpDescription")}
              </CardDescription>
            </CardHeader>
            <AuthForm
              mode={mode}
              onModeChange={onModeChange}
              onSuccess={onSuccess}
              onEmailConfirmationRequired={onEmailConfirmationRequired}
            />
          </>
        )}
      </Card>
      <SecureNote>{t("secureSync")}</SecureNote>
    </CardWrap>
  );
};

const CardWrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  inline-size: 100%;
  ${authCardReveal("0.16s")};
`;

const Card = styled.section`
  inline-size: 100%;
  padding: ${({ theme }) => theme.spacing.lg};
  border: 1px solid ${({ theme }) => theme.colors.border.subtle};
  border-radius: ${({ theme }) => theme.radius.lg};
  background: ${({ theme }) => theme.colors.background.card};
  box-shadow: ${({ theme }) => theme.colors.shadow.card};
  backdrop-filter: blur(12px);
`;

const CardHeader = styled.div`
  margin-block-end: ${({ theme }) => theme.spacing.md};
  ${authTabCrossfade};
`;

const CardTitle = styled.h2`
  margin: 0 0 ${({ theme }) => theme.spacing.xs};
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.preset.sectionTitle.fontSize};
  font-weight: ${({ theme }) => theme.typography.preset.sectionTitle.fontWeight};
  line-height: ${({ theme }) => theme.typography.preset.sectionTitle.lineHeight};
`;

const CardDescription = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.preset.caption.fontSize};
  line-height: ${({ theme }) => theme.typography.preset.caption.lineHeight};
`;

const SecureNote = styled.p`
  margin: 0;
  text-align: start;
  color: ${({ theme }) => theme.colors.text.muted};
  font-size: ${({ theme }) => theme.typography.size.xs};
  line-height: ${({ theme }) => theme.typography.lineHeight.normal};
`;

const SuccessState = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

const SuccessMessage = styled.p`
  margin: 0;
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.colors.status.positiveSoft};
  color: ${({ theme }) => theme.colors.status.positive};
  font-size: ${({ theme }) => theme.typography.preset.body.fontSize};
  line-height: ${({ theme }) => theme.typography.lineHeight.relaxed};
  text-align: center;
`;

const SuccessAction = styled.button`
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.border.subtle};
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.colors.background.card};
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.preset.body.fontSize};
  cursor: pointer;
  transition: transform 0.12s ease, background 0.15s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.background.soft};
  }

  &:active {
    transform: scale(0.98);
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.brand.primary};
    outline-offset: 2px;
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;
