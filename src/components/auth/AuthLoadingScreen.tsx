"use client";

import { useTranslations } from "next-intl";
import styled from "styled-components";
import { authPageBackground } from "@/components/auth/authBackground";
import { authPageFadeIn } from "@/components/auth/authMotion";
import { LoadingState } from "@/components/ui/states/LoadingState";

export const AuthLoadingScreen = () => {
  const t = useTranslations("authWelcome");

  return (
    <Page>
      <LoadingState
        title={t("loading")}
        description={t("loadingDescription")}
        variant="inline"
      />
    </Page>
  );
};

const Page = styled.div`
  ${authPageBackground};
  ${authPageFadeIn};
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.lg};
`;
