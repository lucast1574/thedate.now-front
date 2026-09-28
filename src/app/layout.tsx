import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import "./globals.css";
const serif = Cormorant_Garamond({ variable: "--font-serif", subsets: ["latin"], display: "swap" });
const sans = DM_Sans({ variable: "--font-sans", subsets: ["latin"], display: "swap" });
export const metadata: Metadata = { title: "The Date — Invitaciones que se sienten", description: "Invitaciones para bodas, cumpleaños y celebraciones. Organiza invitados y respuestas en un solo lugar." };
export default function RootLayout({ children }: LayoutProps<"/">) { return <html lang="es" className={`${serif.variable} ${sans.variable}`}><body>{children}</body></html>; }
