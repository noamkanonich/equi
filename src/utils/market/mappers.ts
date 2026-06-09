export const mapWeekdayToMarketDay = (weekday: string) => {
  return weekday !== "Sat" && weekday !== "Sun";
};
