import { setRequestLocale } from "next-intl/server";
import { Suspense } from "react";
import { SettingsPage } from "@/components/settings/SettingsPage";

type Props = {
  params: Promise<{ locale: string }>;
};

const SettingsRoutePage = async ({ params }: Props) => {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <Suspense fallback={null}>
      <SettingsPage />
    </Suspense>
  );
};

export default SettingsRoutePage;
