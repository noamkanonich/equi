import { getTranslations, setRequestLocale } from "next-intl/server";
import { AlertsCenterPage } from "@/components/alerts/AlertsCenterPage";

type Props = {
  params: Promise<{ locale: string }>;
};

const AlertsRoutePage = async ({ params }: Props) => {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("alerts");

  return <AlertsCenterPage title={t("title")} subtitle={t("subtitle")} />;
};

export default AlertsRoutePage;
