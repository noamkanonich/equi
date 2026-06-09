import { useEffect } from "react";
import { useAppStore } from "@/store/app.store";
import { getExchangeRates } from "@/utils/currencies/getExchangeRates";

export const useCurrencyRates = () => {
  const fxRatesMeta = useAppStore((state) => state.fxRatesMeta);
  const isLoadingFxRates = useAppStore((state) => state.isLoadingFxRates);
  const setFxRates = useAppStore((state) => state.setFxRates);
  const setIsLoadingFxRates = useAppStore((state) => state.setIsLoadingFxRates);

  useEffect(() => {
    if (fxRatesMeta.source === "frankfurter" && !fxRatesMeta.isFallback) {
      return;
    }

    let isCancelled = false;

    const loadRates = async () => {
      setIsLoadingFxRates(true);

      try {
        const response = await getExchangeRates();

        if (!isCancelled) {
          setFxRates(response.rates, response.meta);
        }
      } catch {
        // Route always returns usable data; keep existing store rates on client error.
      } finally {
        if (!isCancelled) {
          setIsLoadingFxRates(false);
        }
      }
    };

    void loadRates();

    return () => {
      isCancelled = true;
    };
  }, [fxRatesMeta.isFallback, fxRatesMeta.source, setFxRates, setIsLoadingFxRates]);

  return {
    isLoading: isLoadingFxRates,
    isFallback: fxRatesMeta.isFallback,
    meta: fxRatesMeta,
  };
};
