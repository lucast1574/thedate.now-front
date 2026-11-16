import { getTranslator } from "@/lib/i18n/server";
import type { ReactNode } from "react";
import ApplicationDocument from "@/components/application-document";
import "./globals.css";
export async function generateMetadata() {
  const i18n = await getTranslator();
  return {
    title: i18n("Mi espacio — The Date"),
    robots: { index: false, follow: false },
    icons: { icon: "/event-icon.png?v=2" },
  };
}
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <ApplicationDocument product="general">{children}</ApplicationDocument>
  );
}
