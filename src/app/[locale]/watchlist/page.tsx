import { getTranslations, setRequestLocale } from "next-intl/server";
import { WatchlistPage as WatchlistOpportunityPage } from "@/components/watchlist/WatchlistPage";

type Props = {
  params: Promise<{ locale: string }>;
};

const WatchlistRoutePage = async ({ params }: Props) => {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("watchlist");

  return <WatchlistOpportunityPage title={t("title")} subtitle={t("subtitle")} />;
};

export default WatchlistRoutePage;
