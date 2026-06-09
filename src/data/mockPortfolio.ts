import type { Holding, PortfolioSummary } from "@/types/portfolio";
import { companyProfileLogoUrls } from "@/data/stocks/company-profile-logos.mock";

export const mockHoldings: Holding[] = [
  {
    symbol: "AAPL",
    name: "Apple Inc.",
    logoUrl: companyProfileLogoUrls.AAPL,
    shares: 50,
    avgCost: 165.0,
    currentPrice: 178.5,
    value: 8925,
    allocationPercent: 35,
  },
  {
    symbol: "MSFT",
    name: "Microsoft Corporation",
    logoUrl: companyProfileLogoUrls.MSFT,
    shares: 30,
    avgCost: 380.0,
    currentPrice: 415.2,
    value: 12456,
    allocationPercent: 48,
  },
  {
    symbol: "NVDA",
    name: "NVIDIA Corporation",
    logoUrl: companyProfileLogoUrls.NVDA,
    shares: 5,
    avgCost: 720.0,
    currentPrice: 875.0,
    value: 4375,
    allocationPercent: 17,
  },
];

export const mockPortfolioSummary: PortfolioSummary = {
  totalValue: 25756,
  totalCost: 23400,
  totalGainLoss: 2356,
  totalGainLossPercent: 10.07,
  holdingsCount: 3,
};
