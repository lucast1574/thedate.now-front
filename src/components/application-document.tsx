import { NextIntlClientProvider } from "next-intl";
import { getLocale } from "next-intl/server";
import type { ReactNode } from "react";
import {
  Bodoni_Moda,
  Cormorant_Garamond,
  DM_Sans,
  Nunito,
} from "next/font/google";
import type { Kind } from "@/lib/events/types";
import PublicationFeedback from "@/features/designer/publication-feedback";
const serif = Cormorant_Garamond({
  variable: "--font-serif",
  subsets: ["latin"],
  display: "swap",
});
const sans = DM_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});
const party = Nunito({
  variable: "--font-party",
  subsets: ["latin"],
  display: "swap",
});
const weddingLogo = Bodoni_Moda({
  variable: "--font-wedding-logo",
  subsets: ["latin"],
  display: "swap",
});
export default async function ApplicationDocument({
  children,
  product,
}: {
  children: ReactNode;
  product: Kind;
}) {
  const locale = await getLocale();
  return (
    <html
      lang={locale}
      data-product={product}
      data-application={product === "wedding" ? "save-the-date" : "the-date"}
      className={`${serif.variable} ${sans.variable} ${party.variable} ${weddingLogo.variable}`}
    >
      <body>
        <NextIntlClientProvider locale={locale} messages={{}}>
          <PublicationFeedback>{children}</PublicationFeedback>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
