import { getTranslations, setRequestLocale } from "next-intl/server";
import { ReportsPage } from "@/components/reports/ReportsPage";

type Props = {
  params: Promise<{ locale: string }>;
};

const ReportsRoutePage = async ({ params }: Props) => {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("reports");

  return <ReportsPage title={t("title")} subtitle={t("subtitle")} />;
};

export default ReportsRoutePage;
