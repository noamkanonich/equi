"use client";

import { Check, X } from "lucide-react";
import { useTranslations } from "next-intl";
import styled, { css } from "styled-components";
import { PAYWALL_PLAN_CONFIGS, type BillingPeriod, type PlanConfig } from "@/data/paywall/paywall.types";

type PaywallPlanCardProps = {
  plan: PlanConfig;
  billing: BillingPeriod;
};

export const PaywallPlanCard = ({ plan, billing }: PaywallPlanCardProps) => {
  const t = useTranslations("paywall");

  const price = billing === "yearly" ? plan.yearlyPrice : plan.monthlyPrice;
  const isFree = price === 0;

  const trialThenPlan = plan.trialThenPlanId
    ? PAYWALL_PLAN_CONFIGS.find((p) => p.id === plan.trialThenPlanId)
    : null;
  const trialThenPrice = trialThenPlan
    ? (billing === "yearly" ? trialThenPlan.yearlyPrice : trialThenPlan.monthlyPrice)
    : null;

  return (
    <Card $highlighted={plan.highlighted}>
      {plan.highlighted ? (
        <PopularBadge>{t("plans.popularBadge")}</PopularBadge>
      ) : null}

      {plan.isTrial ? <TrialBadge>{t("plans.free.trialBadge")}</TrialBadge> : null}

      <PlanName>{t(`plans.${plan.id}.name`)}</PlanName>

      {plan.isTrial ? (
        <TrialPriceBlock>
          <PriceAmount>{t("plans.free.trialDays")}</PriceAmount>
          {trialThenPrice !== null ? (
            <TrialThenText>
              {t("plans.free.trialThen", {
                currency: plan.currency,
                price: trialThenPrice,
              })}
            </TrialThenText>
          ) : null}
        </TrialPriceBlock>
      ) : (
        <PriceRow>
          {!isFree ? <Currency>{plan.currency}</Currency> : null}
          <PriceAmount>{isFree ? t("plans.free.price") : price}</PriceAmount>
          {!isFree ? (
            <PricePer>
              /{t(billing === "yearly" ? "billing.perMonthYearly" : "billing.perMonth")}
            </PricePer>
          ) : null}
        </PriceRow>
      )}

      <PlanDescription>{t(`plans.${plan.id}.description`)}</PlanDescription>

      <FeatureList>
        {plan.features.map((feature) => (
          <FeatureItem key={feature.key} $included={feature.included}>
            <FeatureIcon $included={feature.included} aria-hidden>
              {feature.included ? (
                <Check size={13} strokeWidth={2.5} />
              ) : (
                <X size={13} strokeWidth={2.5} />
              )}
            </FeatureIcon>
            {t(`features.${feature.key}`)}
          </FeatureItem>
        ))}
      </FeatureList>

      <CtaButton type="button" $highlighted={plan.highlighted} disabled>
        {plan.isTrial
          ? t("plans.ctaTrial")
          : t(plan.highlighted ? "plans.ctaHighlighted" : "plans.cta")}
      </CtaButton>
    </Card>
  );
};

const Card = styled.div<{ $highlighted: boolean }>`
  position: relative;
  display: flex;
  flex-direction: column;
  padding: 1.25rem 1rem;
  border-radius: ${({ theme }) => theme.radius.lg};
  border: ${({ theme, $highlighted }) =>
    $highlighted
      ? `2px solid ${theme.colors.brand.primary}`
      : `1px solid ${theme.colors.border.subtle}`};
  background: ${({ theme, $highlighted }) =>
    $highlighted ? theme.colors.background.soft : theme.colors.background.card};
  flex: 1;
  min-width: 0;
  transition: transform 0.22s cubic-bezier(0.22, 1, 0.36, 1);

  &:hover {
    transform: translateY(-2px);
  }

  ${({ $highlighted }) =>
    $highlighted &&
    css`
      box-shadow: 0 8px 24px rgba(37, 99, 235, 0.12);
    `}
`;

const PopularBadge = styled.span`
  position: absolute;
  inset-block-start: -0.7rem;
  inset-inline-start: 50%;
  transform: translateX(-50%);
  display: inline-flex;
  align-items: center;
  padding: 0.2rem 0.75rem;
  border-radius: 999px;
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.colors.brand.primary},
    ${({ theme }) => theme.colors.chart.purple}
  );
  color: #fff;
  font-size: 0.65rem;
  font-weight: ${({ theme }) => theme.typography.weight.bold};
  letter-spacing: 0.03em;
  white-space: nowrap;
`;

const PlanName = styled.h3`
  margin: 0 0 0.5rem;
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.preset.cardTitle.fontSize};
  font-weight: ${({ theme }) => theme.typography.weight.bold};
`;

const PriceRow = styled.div`
  display: flex;
  align-items: baseline;
  gap: 0.15rem;
  margin-block-end: 0.35rem;
`;

const Currency = styled.span`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.preset.body.fontSize};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
`;

const PriceAmount = styled.span`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: 1.75rem;
  font-weight: ${({ theme }) => theme.typography.weight.bold};
  line-height: 1;
`;

const PricePer = styled.span`
  color: ${({ theme }) => theme.colors.text.muted};
  font-size: ${({ theme }) => theme.typography.preset.caption.fontSize};
`;

const PlanDescription = styled.p`
  margin: 0 0 1rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.preset.caption.fontSize};
  line-height: 1.5;
`;

const FeatureList = styled.ul`
  list-style: none;
  margin: 0 0 1.25rem;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
  flex: 1;
`;

const FeatureItem = styled.li<{ $included: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: ${({ theme, $included }) =>
    $included ? theme.colors.text.primary : theme.colors.text.muted};
  font-size: ${({ theme }) => theme.typography.preset.caption.fontSize};
  opacity: ${({ $included }) => ($included ? 1 : 0.5)};
`;

const FeatureIcon = styled.span<{ $included: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 1.1rem;
  height: 1.1rem;
  border-radius: 50%;
  background: ${({ theme, $included }) =>
    $included ? theme.colors.status.positiveSoft : theme.colors.background.soft};
  color: ${({ theme, $included }) =>
    $included ? theme.colors.status.positive : theme.colors.text.muted};
`;

const TrialBadge = styled.span`
  display: inline-flex;
  align-self: flex-start;
  align-items: center;
  padding: 0.15rem 0.55rem;
  margin-block-end: 0.5rem;
  border-radius: 999px;
  background: color-mix(in srgb, ${({ theme }) => theme.colors.brand.primary} 12%, transparent);
  color: ${({ theme }) => theme.colors.brand.primary};
  font-size: 0.65rem;
  font-weight: ${({ theme }) => theme.typography.weight.bold};
  letter-spacing: 0.04em;
  text-transform: uppercase;
`;

const TrialPriceBlock = styled.div`
  margin-block-end: 0.35rem;
`;

const TrialThenText = styled.p`
  margin: 0.25rem 0 0;
  color: ${({ theme }) => theme.colors.text.muted};
  font-size: ${({ theme }) => theme.typography.preset.caption.fontSize};
`;

const CtaButton = styled.button<{ $highlighted: boolean }>`
  width: 100%;
  padding: 0.6rem 1rem;
  border: ${({ theme, $highlighted }) =>
    $highlighted ? "0" : `1px solid ${theme.colors.border.subtle}`};
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme, $highlighted }) =>
    $highlighted
      ? `linear-gradient(135deg, ${theme.colors.brand.primary}, ${theme.colors.chart.purple})`
      : "transparent"};
  color: ${({ theme, $highlighted }) =>
    $highlighted ? "#fff" : theme.colors.text.primary};
  font: inherit;
  font-size: ${({ theme }) => theme.typography.preset.caption.fontSize};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
  cursor: not-allowed;
  opacity: 0.72;
`;
