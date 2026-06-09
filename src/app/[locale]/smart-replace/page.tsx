import { setRequestLocale } from "next-intl/server";
import { SmartReplacePage as SmartReplacePageView } from "@/components/smart-replace/SmartReplacePage";

type Props = {
  params: Promise<{ locale: string }>;
};

const SmartReplacePage = async ({ params }: Props) => {
  const { locale } = await params;
  setRequestLocale(locale);

  return <SmartReplacePageView />;
};

export default SmartReplacePage;
