export const mapMarketSessionStatusTone = (status: "open" | "closed") => {
  if (status === "open") {
    return "positive";
  }

  return "neutral";
};
