"use client";

import { useTranslations } from "next-intl";
import styled from "styled-components";
import { Badge } from "@/components/ui/Badge";

export const MockDataBadge = () => {
  const t = useTranslations("stockSearch");

  return (
    <StyledBadge $tone="warning" aria-label={t("mockBadge")}>
      {t("mockBadge")}
    </StyledBadge>
  );
};

const StyledBadge = styled(Badge)`
  flex-shrink: 0;
`;
