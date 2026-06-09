import { setRequestLocale } from "next-intl/server";
import { NextMovesPage as NextMovesPageView } from "@/components/next-moves/NextMovesPage";

type Props = {
  params: Promise<{ locale: string }>;
};

const NextMovesPage = async ({ params }: Props) => {
  const { locale } = await params;
  setRequestLocale(locale);

  return <NextMovesPageView />;
};

export default NextMovesPage;
