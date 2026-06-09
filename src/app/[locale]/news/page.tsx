import { getTranslations, setRequestLocale } from "next-intl/server";
import { NewsPage } from "@/components/news/NewsPage";

type Props = {
  params: Promise<{ locale: string }>;
};

const NewsRoutePage = async ({ params }: Props) => {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("news");

  return <NewsPage title={t("title")} subtitle={t("subtitle")} />;
};

export default NewsRoutePage;
