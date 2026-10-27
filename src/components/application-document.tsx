import type { ReactNode } from "react";
import {
  Bodoni_Moda,
  Cormorant_Garamond,
  DM_Sans,
  Nunito,
} from "next/font/google";
import type { Kind } from "@/lib/events/types";
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
export default function ApplicationDocument({
  children,
  product,
}: {
  children: ReactNode;
  product: Kind;
}) {
  return (
    <html
      lang="es"
      data-product={product}
      data-application={product === "wedding" ? "save-the-date" : "the-date"}
      className={`${serif.variable} ${sans.variable} ${party.variable} ${weddingLogo.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
