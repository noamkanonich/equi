"use client";

import styled from "styled-components";
import type { CurrencyCode } from "@/data/currencies/currency.types";
import { useAppStore } from "@/store/app.store";
import { getDisplayMoney } from "@/utils/currencies/getDisplayMoney";

type DisplayMoneyProps = {
  amount: number;
  currency: CurrencyCode;
  locale: string;
  layout?: "stacked" | "inline";
  inheritColor?: boolean;
};

export const DisplayMoney = ({
  amount,
  currency,
  locale,
  layout = "stacked",
  inheritColor = false,
}: DisplayMoneyProps) => {
  const displayCurrency = useAppStore((state) => state.displayCurrency);
  const fxRates = useAppStore((state) => state.fxRates);

  const { primary, secondary, showSecondary } = getDisplayMoney({
    amount,
    originalCurrency: currency,
    displayCurrency,
    locale,
    fxRates,
  });

  if (!showSecondary || !secondary) {
    return (
      <Primary $layout={layout} $inheritColor={inheritColor} dir="ltr">
        {primary}
      </Primary>
    );
  }

  return (
    <Wrap $layout={layout}>
      <Primary $layout={layout} $inheritColor={inheritColor} dir="ltr">
        {primary}
      </Primary>
      <Secondary $layout={layout} dir="ltr">
        ({secondary})
      </Secondary>
    </Wrap>
  );
};

const Wrap = styled.span<{ $layout: "stacked" | "inline" }>`
  display: inline-flex;
  flex-direction: ${({ $layout }) => ($layout === "stacked" ? "column" : "row")};
  align-items: ${({ $layout }) => ($layout === "stacked" ? "flex-end" : "baseline")};
  gap: ${({ theme }) => theme.spacing.xs};
  flex-wrap: wrap;
`;

const Primary = styled.span<{ $layout: "stacked" | "inline"; $inheritColor: boolean }>`
  white-space: nowrap;
  ${({ $inheritColor }) => ($inheritColor ? "color: inherit;" : "")}
`;

const Secondary = styled.span<{ $layout: "stacked" | "inline" }>`
  color: ${({ theme }) => theme.colors.text.muted};
  font-size: ${({ theme }) => theme.typography.size.xs};
  font-weight: ${({ theme }) => theme.typography.weight.regular};
  line-height: ${({ theme }) => theme.typography.lineHeight.tight};
  white-space: nowrap;
`;
