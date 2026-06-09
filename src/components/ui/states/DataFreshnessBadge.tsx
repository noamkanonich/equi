"use client";

import { useTranslations } from "next-intl";
import styled from "styled-components";
import { Badge } from "@/components/ui/Badge";
import type { DataFreshnessStatus } from "@/data/ui/ui-state.types";
import { getDataFreshnessLabel } from "@/utils/ui/getDataFreshnessLabel";
import { getDataFreshnessTone } from "@/utils/ui/getDataFreshnessTone";

export type DataFreshnessBadgeProps = {
  status: DataFreshnessStatus;
};

export const DataFreshnessBadge = ({ status }: DataFreshnessBadgeProps) => {
  const t = useTranslations("states.freshness");
  const label = getDataFreshnessLabel(status, t);
  const tone = getDataFreshnessTone(status);

  return (
    <StyledBadge $tone={tone} aria-label={label}>
      {label}
    </StyledBadge>
  );
};

const StyledBadge = styled(Badge)`
  white-space: nowrap;
`;
