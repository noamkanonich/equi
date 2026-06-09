"use client";

import { useEffect, useMemo } from "react";
import type { EnsureStockDataOptions } from "@/data/app-data/app-data.types";
import { useAppDataStore } from "@/store/app-data.store";
import { collectUniqueSymbols } from "@/utils/financial-data/collectUniqueSymbols";

export const useEnsureStockSymbols = (
  symbols: Array<string | undefined | null>,
  options?: EnsureStockDataOptions,
): void => {
  const ensureStockDataForSymbols = useAppDataStore(
    (state) => state.ensureStockDataForSymbols,
  );

  const normalizedSymbols = useMemo(
    () => collectUniqueSymbols(symbols),
    [symbols],
  );

  const symbolsKey = useMemo(
    () => normalizedSymbols.join(","),
    [normalizedSymbols],
  );

  const sectionsKey = options?.sections?.join(",") ?? "quote,profile";
  const scope = options?.scope ?? "display";
  const force = options?.force ?? false;

  useEffect(() => {
    if (normalizedSymbols.length === 0) {
      return;
    }

    void ensureStockDataForSymbols(normalizedSymbols, {
      sections: options?.sections,
      scope,
      force,
    });
  }, [
    ensureStockDataForSymbols,
    force,
    normalizedSymbols,
    options?.sections,
    scope,
    sectionsKey,
    symbolsKey,
  ]);
};
