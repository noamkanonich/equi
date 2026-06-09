export type RecentSearchEntry = {
  symbol: string;
  companyName: string;
  searchedAt: string;
};

export type RecentSearchDisplayEntry = {
  symbol: string;
  displaySymbol: string;
  companyName: string;
  isMock?: boolean;
};
