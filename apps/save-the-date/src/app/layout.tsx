import { getTranslator } from "@/lib/i18n/server";
import type { ReactNode } from "react";
import ApplicationDocument from "@/components/application-document";
import "./globals.css";
export async function generateMetadata() {
  const i18n = await getTranslator();
  return {
    title: i18n("Estudio de bodas — Save the Date"),
    robots: { index: false, follow: false },
    icons: { icon: "/wedding-icon.png?v=4" },
  };
}
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <ApplicationDocument product="wedding">{children}</ApplicationDocument>
  );
}
