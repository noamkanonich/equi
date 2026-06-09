import { setRequestLocale } from "next-intl/server";
import { Suspense } from "react";
import { ProfilePage } from "@/components/profile/ProfilePage";

type Props = {
  params: Promise<{ locale: string }>;
};

const ProfileRoutePage = async ({ params }: Props) => {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <Suspense fallback={null}>
      <ProfilePage />
    </Suspense>
  );
};

export default ProfileRoutePage;
