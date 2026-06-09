import { getTranslations, setRequestLocale } from "next-intl/server";
import { PagePlaceholder } from "@/components/layout/PagePlaceholder";

type Props = {
  params: Promise<{ locale: string }>;
};

const FundamentalAnalysisPage = async ({ params }: Props) => {
  const { locale } = await params;
  setRequestLocale(locale);
  const tNav = await getTranslations("nav");
  const tCommon = await getTranslations("common");

  return (
    <PagePlaceholder
      title={tNav("fundamentalAnalysis")}
      emptyMessage={tCommon("comingSoon")}
    />
  );
};

export default FundamentalAnalysisPage;
