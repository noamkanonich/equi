import type {
  PortfolioHoldingFormInput,
  PortfolioHolding,
} from "@/data/portfolio/portfolio.types";

export type PortfolioHoldingValidationErrors = Partial<
  Record<
    | "symbol"
    | "shares"
    | "averageCost"
    | "purchaseCurrency"
    | "targetAllocationPercent"
    | "duplicateSymbol",
    string
  >
>;

type ValidatePortfolioHoldingOptions = {
  mode: "add" | "edit";
  existingHoldings: PortfolioHolding[];
  editingId?: string;
  bypassDuplicateCheck?: boolean;
};

export const validatePortfolioHolding = (
  input: PortfolioHoldingFormInput,
  options: ValidatePortfolioHoldingOptions,
): PortfolioHoldingValidationErrors => {
  const errors: PortfolioHoldingValidationErrors = {};
  const symbol = input.symbol.trim().toUpperCase();

  if (!symbol) {
    errors.symbol = "required";
  }

  if (!Number.isFinite(input.shares) || input.shares <= 0) {
    errors.shares = "invalidShares";
  }

  if (!Number.isFinite(input.averageCost) || input.averageCost < 0) {
    errors.averageCost = "invalidAverageCost";
  }

  if (!input.purchaseCurrency) {
    errors.purchaseCurrency = "required";
  }

  if (
    input.targetAllocationPercent !== undefined &&
    input.targetAllocationPercent !== null &&
    (input.targetAllocationPercent < 0 || input.targetAllocationPercent > 100)
  ) {
    errors.targetAllocationPercent = "invalidTargetAllocation";
  }

  if (!options.bypassDuplicateCheck) {
    if (options.mode === "add" && symbol) {
      const duplicate = options.existingHoldings.some(
        (holding) => holding.symbol.toUpperCase() === symbol,
      );
      if (duplicate) {
        errors.duplicateSymbol = "duplicateSymbol";
      }
    }

    if (options.mode === "edit" && options.editingId && symbol) {
      const duplicate = options.existingHoldings.some(
        (holding) =>
          holding.id !== options.editingId &&
          holding.symbol.toUpperCase() === symbol,
      );
      if (duplicate) {
        errors.duplicateSymbol = "duplicateSymbol";
      }
    }
  }

  return errors;
};

export const hasValidationErrors = (
  errors: PortfolioHoldingValidationErrors,
): boolean => Object.keys(errors).length > 0;
