import type { Metadata } from "next";
import { headers } from "next/headers";
import {
  Bodoni_Moda,
  Cormorant_Garamond,
  DM_Sans,
  Nunito,
} from "next/font/google";
import "./globals.css";
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
export async function generateMetadata(): Promise<Metadata> {
  const host = ((await headers()).get("host") ?? "").toLowerCase();
  if (host.startsWith("studio.save.thedate.now"))
    return {
      title: "Estudio de bodas — Save the Date",
      description: "Organiza bodas, invitaciones e invitados en un solo lugar.",
      icons: { icon: "/wedding-icon.png?v=4" },
    };
  if (host.startsWith("crea.thedate.now"))
    return {
      title: "Mi espacio — The Date",
      description: "Crea y organiza tus invitaciones para eventos.",
      icons: { icon: "/event-icon.png?v=2" },
    };
  if (host.startsWith("save.thedate.now") || host.endsWith(".save.thedate.now"))
    return {
      title: "Save the Date — Invitaciones de boda",
      description: "Invitaciones de boda que cuentan su historia.",
      icons: { icon: "/wedding-icon.png?v=4" },
    };
  return {
    title: "The Date — Haz del día un gran plan",
    description: "Invitaciones para cumpleaños, fiestas y encuentros.",
    icons: { icon: "/event-icon.png?v=2" },
  };
}
export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className={`${serif.variable} ${sans.variable} ${party.variable} ${weddingLogo.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
