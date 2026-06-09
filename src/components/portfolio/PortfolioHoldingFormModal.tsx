"use client";

import { AlertTriangle, Briefcase, CheckCircle2, X } from "lucide-react";
import { useEffect, useId, useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import styled, { useTheme } from "styled-components";
import { AddStockSearchStep } from "@/components/add-stock/AddStockSearchStep";
import { BottomSheet } from "@/components/ui/BottomSheet";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { popularAddStockSymbols } from "@/data/add-stock/add-stock.mock";
import type { AddStockSearchResult } from "@/data/add-stock/add-stock.types";
import type { EnrichedPortfolioHolding } from "@/data/portfolio/portfolio.types";
import { useAppData } from "@/providers/useAppData";
import { useAppDataStore } from "@/store/app-data.store";
import { fetchStockSearch } from "@/utils/financial-data/fetchStockSearch";
import { useIsMobileBreakpoint } from "@/utils/client/useIsMobileBreakpoint";
import { enrichAddStockSearchResult } from "@/utils/financial-data/enrichAddStockSearchResult";
import {
  defaultPortfolioHoldingFormInput,
  mapHoldingToFormInput,
} from "@/utils/portfolio/mapHoldingToFormInput";
import { mergeFormWithSearchResult } from "@/utils/portfolio/mapSearchResultToFormMetadata";
import {
  hasValidationErrors,
  validatePortfolioHolding,
} from "@/utils/portfolio/validatePortfolioHolding";
import { PortfolioHoldingForm } from "./PortfolioHoldingForm";

type PortfolioHoldingFormModalProps = {
  isOpen: boolean;
  onClose: () => void;
  mode: "add" | "edit";
  holding?: EnrichedPortfolioHolding;
  initialSymbol?: string;
  initialStock?: AddStockSearchResult;
};

export const PortfolioHoldingFormModal = ({
  isOpen,
  onClose,
  mode,
  holding,
  initialSymbol,
  initialStock,
}: PortfolioHoldingFormModalProps) => {
  const t = useTranslations("portfolio.form");
  const tSuccess = useTranslations("portfolio.success");
  const locale = useLocale();
  const theme = useTheme();
  const titleId = useId();
  const descriptionId = useId();
  const isMobile = useIsMobileBreakpoint(theme.breakpoints.tablet);
  const {
    portfolioHoldings: storeHoldings,
    addPortfolioHolding,
    updatePortfolioHolding,
    stockDataBySymbol,
  } = useAppData();

  const [form, setForm] = useState(defaultPortfolioHoldingFormInput);
  const [errors, setErrors] = useState<ReturnType<typeof validatePortfolioHolding>>({});
  const [isSuccess, setIsSuccess] = useState(false);
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [selectedStock, setSelectedStock] = useState<AddStockSearchResult | null>(null);
  const [apiSearchResults, setApiSearchResults] = useState<AddStockSearchResult[]>([]);
  const [isSearchFetching, setIsSearchFetching] = useState(false);
  const [hasSearchError, setHasSearchError] = useState(false);
  const [isFallback, setIsFallback] = useState(false);
  const [bypassDuplicateCheck, setBypassDuplicateCheck] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedQuery(query), 280);
    return () => window.clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    const trimmed = debouncedQuery.trim();
    if (trimmed.length < 2) {
      setApiSearchResults([]);
      setIsSearchFetching(false);
      setHasSearchError(false);
      setIsFallback(false);
      return;
    }

    let cancelled = false;
    setIsSearchFetching(true);

    void fetchStockSearch(trimmed)
      .then(({ results, meta }) => {
        if (!cancelled) {
          setApiSearchResults(results);
          setHasSearchError(false);
          setIsFallback(meta.isFallback);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setApiSearchResults([]);
          setHasSearchError(true);
          setIsFallback(false);
        }
      })
      .finally(() => {
        if (!cancelled) setIsSearchFetching(false);
      });

    return () => {
      cancelled = true;
    };
  }, [debouncedQuery]);

  useEffect(() => {
    if (!isOpen) return;

    if (mode === "edit" && holding) {
      setForm(mapHoldingToFormInput(holding));
      setSelectedStock(null);
      setQuery("");
    } else if (initialStock) {
      setForm({
        ...defaultPortfolioHoldingFormInput(),
        ...mergeFormWithSearchResult(defaultPortfolioHoldingFormInput(), initialStock),
      });
      setSelectedStock(initialStock);
      setQuery("");
    } else if (initialSymbol) {
      const normalized = initialSymbol.trim().toUpperCase();
      setForm({
        ...defaultPortfolioHoldingFormInput(),
        symbol: normalized,
        averageCost: defaultPortfolioHoldingFormInput().averageCost,
        purchaseCurrency: defaultPortfolioHoldingFormInput().purchaseCurrency,
      });
      setSelectedStock(null);
      setQuery("");
    } else {
      setForm(defaultPortfolioHoldingFormInput());
      setSelectedStock(null);
      setQuery("");
    }
    setErrors({});
    setIsSuccess(false);
    setBypassDuplicateCheck(false);
    setApiSearchResults([]);
    setHasSearchError(false);
    setIsFallback(false);
  }, [isOpen, mode, holding, initialSymbol, initialStock]);

  const isSearching =
    (query.trim().length > 0 && debouncedQuery !== query) || isSearchFetching;

  const searchResults = useMemo(
    () =>
      apiSearchResults.map((stock) =>
        enrichAddStockSearchResult(stock, stockDataBySymbol[stock.symbol]),
      ),
    [apiSearchResults, stockDataBySymbol],
  );

  const handleClose = () => {
    setIsSuccess(false);
    setErrors({});
    onClose();
  };

  const targetAllocationSum = storeHoldings.reduce(
    (sum, item) => sum + (item.targetAllocationPercent ?? 0),
    0,
  );
  const targetAllocationSumWarning =
    (form.targetAllocationPercent ?? 0) > 0 && targetAllocationSum > 100;

  const handleSelectStock = (stock: AddStockSearchResult) => {
    setSelectedStock(stock);
    setForm((current) => mergeFormWithSearchResult(current, stock));
    void useAppDataStore.getState().ensureStockDataForSymbols([stock.symbol], {
      sections: ["quote", "profile"],
    });
  };

  const handleSave = (opts?: { bypass?: boolean }) => {
    const bypass = opts?.bypass ?? bypassDuplicateCheck;
    const validationErrors = validatePortfolioHolding(form, {
      mode,
      existingHoldings: storeHoldings,
      editingId: holding?.id,
      bypassDuplicateCheck: bypass,
    });

    if (hasValidationErrors(validationErrors)) {
      setErrors(validationErrors);
      return;
    }

    if (mode === "add") {
      addPortfolioHolding(form);
    } else if (holding) {
      updatePortfolioHolding(holding.id, form);
    }

    setIsSuccess(true);
  };

  const handleUpdateExisting = () => {
    const symbol = form.symbol.trim().toUpperCase();
    const existing = storeHoldings.find((h) => h.symbol.toUpperCase() === symbol);
    if (!existing) return;
    setErrors({});
    setBypassDuplicateCheck(false);
    setForm(mapHoldingToFormInput(existing as EnrichedPortfolioHolding));
    setSelectedStock(null);
  };

  const handleAddSeparate = () => {
    setBypassDuplicateCheck(true);
    setErrors({});
    handleSave({ bypass: true });
  };

  const canSave = mode === "edit" || Boolean(form.symbol.trim());

  const providerPreview =
    mode === "edit" && holding
      ? {
          companyName: holding.companyName,
          currentPrice: holding.currentPrice,
          currency: holding.purchaseCurrency,
          isMockFallback: holding.dataMeta?.isFallback ?? false,
        }
      : selectedStock
        ? {
            companyName: selectedStock.companyName,
            currentPrice: selectedStock.price,
            currency: selectedStock.currency,
            isMockFallback:
              selectedStock.isMock === true ||
              selectedStock.isFallback === true ||
              stockDataBySymbol[selectedStock.symbol]?.meta?.isFallback === true,
          }
        : undefined;

  const content = isSuccess ? (
    <SuccessWrap>
      <SuccessIcon aria-hidden>
        <CheckCircle2 size={34} strokeWidth={1.8} />
      </SuccessIcon>
      <SuccessTitle>
        {mode === "add" ? tSuccess("added") : tSuccess("updated")}
      </SuccessTitle>
      <Button onClick={handleClose}>{t("done")}</Button>
    </SuccessWrap>
  ) : (
    <Shell key={`${mode}-${holding?.id ?? "add"}-${isOpen}`}>
      {!isMobile ? (
        <Header>
          <HeaderStart>
            <IconWrap aria-hidden>
              <Briefcase size={20} strokeWidth={1.9} />
            </IconWrap>
            <Title id={titleId}>
              {mode === "add" ? t("addTitle") : t("editTitle")}
            </Title>
          </HeaderStart>
          <CloseButton type="button" onClick={handleClose} aria-label={t("cancel")}>
            <X size={18} strokeWidth={1.8} aria-hidden />
          </CloseButton>
        </Header>
      ) : null}

      <Body>
        {mode === "add" && !form.symbol ? (
          <SearchSection>
            <AddStockSearchStep
              query={query}
              popularSymbols={popularAddStockSymbols}
              results={searchResults}
              selectedSymbol={selectedStock?.symbol ?? null}
              isSearching={isSearching}
              hasSearchError={hasSearchError}
              isFallback={isFallback}
              onQueryChange={setQuery}
              onPopularSelect={(symbol) => {
                setQuery(symbol);
                const stock = searchResults.find((item) => item.symbol === symbol);
                if (stock) handleSelectStock(stock);
              }}
              onSelectStock={handleSelectStock}
              onRetrySearch={() => {
                setHasSearchError(false);
                setDebouncedQuery("");
                window.setTimeout(() => setDebouncedQuery(query.trim()), 0);
              }}
            />
          </SearchSection>
        ) : null}

        {canSave ? (
          <PortfolioHoldingForm
            mode={mode}
            form={form}
            errors={errors}
            locale={locale}
            providerPreview={providerPreview}
            targetAllocationSumWarning={targetAllocationSumWarning}
            onChange={setForm}
          />
        ) : null}

        {errors.duplicateSymbol ? (
          <DuplicateChoice>
            <DuplicateRow>
              <DuplicateIcon aria-hidden>
                <AlertTriangle size={18} strokeWidth={1.8} />
              </DuplicateIcon>
              <DuplicateMessage>{t("symbolAlreadyExists")}</DuplicateMessage>
            </DuplicateRow>
            <DuplicateActions>
              <Button $variant="secondary" onClick={handleUpdateExisting}>
                {t("updateExisting")}
              </Button>
              <Button $variant="secondary" onClick={handleAddSeparate}>
                {t("addSeparateHolding")}
              </Button>
            </DuplicateActions>
          </DuplicateChoice>
        ) : null}
      </Body>

      {canSave ? (
        <Footer>
          <Button $variant="secondary" onClick={handleClose}>
            {t("cancel")}
          </Button>
          <Button onClick={() => handleSave()}>{t("save")}</Button>
        </Footer>
      ) : null}
    </Shell>
  );

  const modalTitle = mode === "add" ? t("addTitle") : t("editTitle");

  if (isMobile) {
    return (
      <BottomSheet
        isOpen={isOpen}
        onClose={handleClose}
        title={modalTitle}
        closeLabel={t("cancel")}
      >
        {content}
      </BottomSheet>
    );
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      labelledBy={titleId}
      describedBy={descriptionId}
    >
      <PanelWrap>{content}</PanelWrap>
    </Modal>
  );
};

const PanelWrap = styled.div`
  inline-size: min(40rem, 100%);
  margin-inline: auto;
`;

const Shell = styled.div`
  display: flex;
  flex-direction: column;
  max-block-size: min(85vh, 48rem);
`;

const Header = styled.header`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.lg};
  border-block-end: 1px solid ${({ theme }) => theme.colors.border.subtle};
`;

const HeaderStart = styled.div`
  display: flex;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.sm};
  min-inline-size: 0;
`;

const IconWrap = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  inline-size: 2.5rem;
  block-size: 2.5rem;
  flex-shrink: 0;
  border-radius: ${({ theme }) => theme.radius.md};
  color: ${({ theme }) => theme.colors.brand.primary};
  background: ${({ theme }) => theme.colors.brand.primarySoft};
`;

const Title = styled.h2`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.preset.sectionTitle.fontSize};
  font-weight: ${({ theme }) => theme.typography.preset.sectionTitle.fontWeight};
`;

const CloseButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  inline-size: 2rem;
  block-size: 2rem;
  border: 0;
  border-radius: ${({ theme }) => theme.radius.md};
  background: transparent;
  color: ${({ theme }) => theme.colors.text.muted};
  cursor: pointer;
`;

const Body = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
  overflow-y: auto;
  flex: 1;
  min-block-size: 0;
`;

const SearchSection = styled.div`
  margin-block-end: ${({ theme }) => theme.spacing.lg};
`;

const Footer = styled.footer`
  display: flex;
  justify-content: flex-end;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  border-block-start: 1px solid ${({ theme }) => theme.colors.border.subtle};

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet - 1}px) {
    & > button {
      flex: 1;
    }
  }
`;

const SuccessWrap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.xl};
  text-align: center;
`;

const SuccessIcon = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  inline-size: 4rem;
  block-size: 4rem;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.status.positiveSoft};
  color: ${({ theme }) => theme.colors.status.positive};
`;

const SuccessTitle = styled.h3`
  margin: 0;
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.preset.sectionTitle.fontSize};
`;

const DuplicateChoice = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-block-start: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.radius.md};
  border: 1px solid ${({ theme }) => theme.colors.status.warning};
  background: ${({ theme }) => theme.colors.status.warningSoft};
`;

const DuplicateRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const DuplicateIcon = styled.span`
  display: inline-flex;
  flex-shrink: 0;
  margin-block-start: 1px;
  color: ${({ theme }) => theme.colors.status.warning};
`;

const DuplicateMessage = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.preset.caption.fontSize};
  font-weight: ${({ theme }) => theme.typography.weight.medium};
  line-height: ${({ theme }) => theme.typography.preset.caption.lineHeight};
`;

const DuplicateActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.sm};
`;
