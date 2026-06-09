import { companyProfileLogoUrls } from "@/data/stocks/company-profile-logos.mock";

export type PortfolioQuoteFallback = {
  companyName: string;
  logoUrl?: string | null;
  currentPrice: number;
  dayChangePercent: number;
  recentCloses: number[];
};

/** Fallback quote data when provider bundles are unavailable. */
export const portfolioMockQuoteFallbacks: Record<string, PortfolioQuoteFallback> = {
  AAPL: {
    companyName: "Apple Inc.",
    logoUrl: companyProfileLogoUrls.AAPL,
    currentPrice: 195.42,
    dayChangePercent: 1.25,
    recentCloses: [189.72, 190.84, 192.39, 194.5, 193.62, 195.42],
  },
  MSFT: {
    companyName: "Microsoft Corp.",
    logoUrl: companyProfileLogoUrls.MSFT,
    currentPrice: 425.3,
    dayChangePercent: 0.68,
    recentCloses: [416.74, 418.92, 421.22, 422.99, 422.43, 425.3],
  },
  NVDA: {
    companyName: "NVIDIA Corporation",
    logoUrl: companyProfileLogoUrls.NVDA,
    currentPrice: 131.38,
    dayChangePercent: 2.9,
    recentCloses: [121.42, 123.78, 126.09, 128.75, 127.68, 131.38],
  },
  GOOGL: {
    companyName: "Alphabet Inc.",
    logoUrl: companyProfileLogoUrls.GOOGL,
    currentPrice: 168.73,
    dayChangePercent: -0.35,
    recentCloses: [171.04, 170.12, 169.24, 168.77, 169.32, 168.73],
  },
  AMZN: {
    companyName: "Amazon.com, Inc.",
    logoUrl: companyProfileLogoUrls.AMZN,
    currentPrice: 186.21,
    dayChangePercent: 0.22,
    recentCloses: [183.82, 184.9, 185.23, 185.8, 185.8, 186.21],
  },
  TSLA: {
    companyName: "Tesla, Inc.",
    logoUrl: companyProfileLogoUrls.TSLA,
    currentPrice: 178.95,
    dayChangePercent: -1.23,
    recentCloses: [188.24, 186.42, 184.65, 181.97, 181.18, 178.95],
  },
  META: {
    companyName: "Meta Platforms, Inc.",
    logoUrl: companyProfileLogoUrls.META,
    currentPrice: 478.16,
    dayChangePercent: -0.11,
    recentCloses: [475.74, 476.62, 477.48, 477.86, 478.69, 478.16],
  },
};
