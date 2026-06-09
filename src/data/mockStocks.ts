import type { Stock } from "@/types/stock";
import { companyProfileLogoUrls } from "@/data/stocks/company-profile-logos.mock";

export const mockStocks: Stock[] = [
  {
    symbol: "AAPL",
    name: "Apple Inc.",
    logoUrl: companyProfileLogoUrls.AAPL,
    price: 178.5,
    changePercent: 1.2,
    sector: "Technology",
    marketCap: 2_800_000_000_000,
  },
  {
    symbol: "MSFT",
    name: "Microsoft Corporation",
    logoUrl: companyProfileLogoUrls.MSFT,
    price: 415.2,
    changePercent: -0.4,
    sector: "Technology",
    marketCap: 3_100_000_000_000,
  },
  {
    symbol: "NVDA",
    name: "NVIDIA Corporation",
    logoUrl: companyProfileLogoUrls.NVDA,
    price: 875.0,
    changePercent: 2.8,
    sector: "Technology",
    marketCap: 2_200_000_000_000,
  },
];
