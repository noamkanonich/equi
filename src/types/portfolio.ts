export interface Holding {
  symbol: string;
  name: string;
  logoUrl?: string | null;
  shares: number;
  avgCost: number;
  currentPrice: number;
  value: number;
  allocationPercent: number;
}

export interface PortfolioSummary {
  totalValue: number;
  totalCost: number;
  totalGainLoss: number;
  totalGainLossPercent: number;
  holdingsCount: number;
}
