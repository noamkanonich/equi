export type BillingPeriod = "monthly" | "yearly";

export type PlanId = "free" | "pro" | "proPlus";

export type PlanFeature = {
  key: string;
  included: boolean;
};

export type PlanConfig = {
  id: PlanId;
  monthlyPrice: number | null;
  yearlyPrice: number | null;
  currency: string;
  highlighted: boolean;
  isTrial?: boolean;
  trialDays?: number;
  trialThenPlanId?: PlanId;
  features: PlanFeature[];
};

export const PAYWALL_PLAN_CONFIGS: PlanConfig[] = [
  {
    id: "free",
    monthlyPrice: 0,
    yearlyPrice: 0,
    currency: "₪",
    highlighted: false,
    isTrial: true,
    trialDays: 7,
    trialThenPlanId: "pro",
    features: [
      { key: "portfolioTracking", included: true },
      { key: "basicAlerts", included: true },
      { key: "newsDigest", included: true },
      { key: "aiInsights", included: true },
      { key: "smartReplace", included: true },
      { key: "advancedReports", included: true },
    ],
  },
  {
    id: "pro",
    monthlyPrice: 79,
    yearlyPrice: 65,
    currency: "₪",
    highlighted: true,
    features: [
      { key: "portfolioTracking", included: true },
      { key: "basicAlerts", included: true },
      { key: "newsDigest", included: true },
      { key: "aiInsights", included: true },
      { key: "smartReplace", included: true },
      { key: "advancedReports", included: false },
    ],
  },
  {
    id: "proPlus",
    monthlyPrice: 199,
    yearlyPrice: 165,
    currency: "₪",
    highlighted: false,
    features: [
      { key: "portfolioTracking", included: true },
      { key: "basicAlerts", included: true },
      { key: "newsDigest", included: true },
      { key: "aiInsights", included: true },
      { key: "smartReplace", included: true },
      { key: "advancedReports", included: true },
    ],
  },
];
