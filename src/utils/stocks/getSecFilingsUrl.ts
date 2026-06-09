import { symbolToCik } from "@/data/stocks/sec-cik.mock";

export const getSecFilingsUrl = (symbol: string): string | null => {
  const normalized = symbol.trim().toUpperCase();
  const cik = symbolToCik[normalized];

  if (cik) {
    const cikNumber = cik.replace(/^0+/, "");
    return `https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=${cikNumber}&type=&dateb=&owner=include&count=40`;
  }

  return `https://www.sec.gov/edgar/search/#/q=${encodeURIComponent(normalized)}`;
};
