import { setRequestLocale } from "next-intl/server";
import { DashboardPage as DashboardPageView } from "@/components/dashboard/DashboardPage";

type Props = {
  params: Promise<{ locale: string }>;
};

const DashboardPageRoute = async ({ params }: Props) => {
  const { locale } = await params;
  setRequestLocale(locale);

  return <DashboardPageView />;
};

export default DashboardPageRoute;
