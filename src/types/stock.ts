export interface Stock {
  symbol: string;
  name: string;
  logoUrl?: string | null;
  price: number;
  changePercent: number;
  sector?: string;
  marketCap?: number;
}
