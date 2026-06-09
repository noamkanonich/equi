"use client";

import { useTranslations } from "next-intl";
import styled from "styled-components";
import type {
  PortfolioAccountType,
  PortfolioHoldingFormInput,
  PortfolioStrategyTag,
} from "@/data/portfolio/portfolio.types";
import type { CurrencyCode } from "@/data/currencies/currency.types";
import type { PortfolioHoldingValidationErrors } from "@/utils/portfolio/validatePortfolioHolding";
import { DisplayMoney } from "@/components/ui/DisplayMoney";
import { MockDataBadge } from "@/components/ui/MockDataBadge";

const currencyCodes: CurrencyCode[] = ["USD", "ILS", "EUR"];
const accountTypes: PortfolioAccountType[] = [
  "brokerage",
  "retirement",
  "taxAdvantaged",
  "other",
];
const strategyTags: PortfolioStrategyTag[] = [
  "core",
  "growth",
  "income",
  "speculative",
  "watch",
];

type PortfolioHoldingFormProps = {
  mode: "add" | "edit";
  form: PortfolioHoldingFormInput;
  errors: PortfolioHoldingValidationErrors;
  locale: string;
  providerPreview?: {
    companyName: string;
    currentPrice: number;
    currency: CurrencyCode;
    isMockFallback?: boolean;
  };
  targetAllocationSumWarning?: boolean;
  onChange: (form: PortfolioHoldingFormInput) => void;
};

export const PortfolioHoldingForm = ({
  mode,
  form,
  errors,
  locale,
  providerPreview,
  targetAllocationSumWarning,
  onChange,
}: PortfolioHoldingFormProps) => {
  const t = useTranslations("portfolio.form");
  const tAccount = useTranslations("portfolio.accountType");
  const tStrategy = useTranslations("portfolio.strategy");

  const errorMessage = (key?: string) => {
    if (!key) return null;
    if (key === "required") return t("required");
    if (key === "invalidShares") return t("invalidShares");
    if (key === "invalidAverageCost") return t("invalidAverageCost");
    if (key === "invalidTargetAllocation") return t("invalidTargetAllocation");
    if (key === "duplicateSymbol") return t("duplicateSymbol");
    return t("required");
  };

  return (
    <FormGrid>
      {providerPreview ? (
        <ProviderPreview>
          <ProviderPreviewStart>
            <ProviderName>{providerPreview.companyName}</ProviderName>
            {providerPreview.isMockFallback ? <MockDataBadge /> : null}
          </ProviderPreviewStart>
          <DisplayMoney
            amount={providerPreview.currentPrice}
            currency={providerPreview.currency}
            locale={locale}
          />
        </ProviderPreview>
      ) : null}

      <Field>
        <Label htmlFor="portfolio-form-symbol">{t("symbol")}</Label>
        <SymbolInput
          id="portfolio-form-symbol"
          value={form.symbol}
          readOnly
          dir="ltr"
          aria-readonly
        />
        {mode === "edit" ? (
          <Hint>{t("symbolReadOnly")}</Hint>
        ) : null}
        {errors.symbol || errors.duplicateSymbol ? (
          <ErrorText>{errorMessage(errors.symbol ?? errors.duplicateSymbol)}</ErrorText>
        ) : null}
      </Field>

      <FieldRow>
        <Field>
          <Label htmlFor="portfolio-form-shares">{t("shares")}</Label>
          <NumberInput
            id="portfolio-form-shares"
            type="number"
            min={0}
            step="any"
            dir="ltr"
            value={form.shares || ""}
            onChange={(event) =>
              onChange({
                ...form,
                shares: Number(event.target.value),
              })
            }
          />
          {errors.shares ? (
            <ErrorText>{errorMessage(errors.shares)}</ErrorText>
          ) : null}
        </Field>

        <Field>
          <Label htmlFor="portfolio-form-average-cost">{t("averageCost")}</Label>
          <NumberInput
            id="portfolio-form-average-cost"
            type="number"
            min={0}
            step="any"
            dir="ltr"
            value={form.averageCost || ""}
            onChange={(event) =>
              onChange({
                ...form,
                averageCost: Number(event.target.value),
              })
            }
          />
          {errors.averageCost ? (
            <ErrorText>{errorMessage(errors.averageCost)}</ErrorText>
          ) : null}
        </Field>
      </FieldRow>

      <FieldRow>
        <Field>
          <Label htmlFor="portfolio-form-currency">{t("purchaseCurrency")}</Label>
          <Select
            id="portfolio-form-currency"
            value={form.purchaseCurrency}
            onChange={(event) =>
              onChange({
                ...form,
                purchaseCurrency: event.target.value as CurrencyCode,
              })
            }
          >
            {currencyCodes.map((code) => (
              <option key={code} value={code}>
                {code}
              </option>
            ))}
          </Select>
          {errors.purchaseCurrency ? (
            <ErrorText>{errorMessage(errors.purchaseCurrency)}</ErrorText>
          ) : null}
        </Field>

        <Field>
          <Label htmlFor="portfolio-form-date">{t("purchaseDate")}</Label>
          <DateInput
            id="portfolio-form-date"
            type="date"
            dir="ltr"
            value={form.purchaseDate ?? ""}
            onChange={(event) =>
              onChange({ ...form, purchaseDate: event.target.value })
            }
          />
        </Field>
      </FieldRow>

      <FieldRow>
        <Field>
          <Label htmlFor="portfolio-form-account">{t("accountName")}</Label>
          <TextInput
            id="portfolio-form-account"
            value={form.accountName ?? ""}
            onChange={(event) =>
              onChange({ ...form, accountName: event.target.value })
            }
          />
        </Field>

        <Field>
          <Label htmlFor="portfolio-form-account-type">{t("accountType")}</Label>
          <Select
            id="portfolio-form-account-type"
            value={form.accountType ?? ""}
            onChange={(event) =>
              onChange({
                ...form,
                accountType: event.target.value
                  ? (event.target.value as PortfolioAccountType)
                  : undefined,
              })
            }
          >
            <option value="">{t("accountTypeOptional")}</option>
            {accountTypes.map((type) => (
              <option key={type} value={type}>
                {tAccount(type)}
              </option>
            ))}
          </Select>
        </Field>
      </FieldRow>

      <FieldRow>
        <Field>
          <Label htmlFor="portfolio-form-target">{t("targetAllocation")}</Label>
          <NumberInput
            id="portfolio-form-target"
            type="number"
            min={0}
            max={100}
            step="any"
            dir="ltr"
            value={form.targetAllocationPercent ?? ""}
            onChange={(event) =>
              onChange({
                ...form,
                targetAllocationPercent: event.target.value
                  ? Number(event.target.value)
                  : undefined,
              })
            }
          />
          {errors.targetAllocationPercent ? (
            <ErrorText>{errorMessage(errors.targetAllocationPercent)}</ErrorText>
          ) : null}
          {targetAllocationSumWarning ? (
            <WarningText>{t("targetAllocationSumWarning")}</WarningText>
          ) : null}
        </Field>

        <Field>
          <Label htmlFor="portfolio-form-strategy">{t("strategyTag")}</Label>
          <Select
            id="portfolio-form-strategy"
            value={form.strategyTag ?? ""}
            onChange={(event) =>
              onChange({
                ...form,
                strategyTag: event.target.value
                  ? (event.target.value as PortfolioStrategyTag)
                  : undefined,
              })
            }
          >
            <option value="">{t("strategyOptional")}</option>
            {strategyTags.map((tag) => (
              <option key={tag} value={tag}>
                {tStrategy(tag)}
              </option>
            ))}
          </Select>
        </Field>
      </FieldRow>

      <Field>
        <Label htmlFor="portfolio-form-notes">{t("notes")}</Label>
        <TextArea
          id="portfolio-form-notes"
          rows={3}
          value={form.notes ?? ""}
          onChange={(event) => onChange({ ...form, notes: event.target.value })}
        />
      </Field>
    </FormGrid>
  );
};

const FormGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

const FieldRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({ theme }) => theme.spacing.md};

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet - 1}px) {
    grid-template-columns: 1fr;
  }
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
  min-inline-size: 0;
`;

const Label = styled.label`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.preset.caption.fontSize};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
`;

const TextInput = styled.input`
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.border.subtle};
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.colors.background.app};
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.preset.body.fontSize};
`;

const SymbolInput = styled(TextInput)`
  background: ${({ theme }) => theme.colors.background.soft};
  font-weight: ${({ theme }) => theme.typography.weight.bold};
`;

const NumberInput = styled(TextInput)``;

const DateInput = styled(TextInput)``;

const Select = styled.select`
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.border.subtle};
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.colors.background.app};
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.preset.body.fontSize};
`;

const TextArea = styled.textarea`
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.border.subtle};
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.colors.background.app};
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.preset.body.fontSize};
  resize: vertical;
`;

const Hint = styled.span`
  color: ${({ theme }) => theme.colors.text.muted};
  font-size: ${({ theme }) => theme.typography.preset.caption.fontSize};
`;

const ErrorText = styled.span`
  color: ${({ theme }) => theme.colors.status.negative};
  font-size: ${({ theme }) => theme.typography.preset.caption.fontSize};
`;

const WarningText = styled.span`
  color: ${({ theme }) => theme.colors.status.warning};
  font-size: ${({ theme }) => theme.typography.preset.caption.fontSize};
`;

const ProviderPreview = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.border.subtle};
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.colors.background.soft};
`;

const ProviderPreviewStart = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.sm};
  min-inline-size: 0;
`;

const ProviderName = styled.span`
  color: ${({ theme }) => theme.colors.text.primary};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
`;
