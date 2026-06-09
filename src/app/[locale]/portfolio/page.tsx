import { setRequestLocale } from "next-intl/server";
import { PortfolioPage as PortfolioPageView } from "@/components/portfolio/PortfolioPage";

type Props = {
  params: Promise<{ locale: string }>;
};

const PortfolioPage = async ({ params }: Props) => {
  const { locale } = await params;
  setRequestLocale(locale);

  return <PortfolioPageView />;
};

export default PortfolioPage;
