import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { GradientBackground } from "@/components/gradient-background/GradientBackground";
import { LocaleAppShell } from "@/components/layout/LocaleAppShell";
import { routing } from "@/i18n/routing";
import { getThemeBootstrapScript } from "@/lib/theme/themeBootstrap";
import { Providers } from "./Providers";

type Props = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

export const generateStaticParams = () => {
  return routing.locales.map((locale) => ({ locale }));
};

const LocaleLayout = async ({ children, params }: Props) => {
  const { locale } = await params;

  if (!routing.locales.includes(locale as "en" | "he")) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();
  const dir = locale === "he" ? "rtl" : "ltr";

  return (
    <html lang={locale} dir={dir} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{ __html: getThemeBootstrapScript() }}
        />
      </head>
      <body>
        <Providers locale={locale} messages={messages}>
          <GradientBackground />
          <LocaleAppShell>{children}</LocaleAppShell>
        </Providers>
      </body>
    </html>
  );
};

export default LocaleLayout;
