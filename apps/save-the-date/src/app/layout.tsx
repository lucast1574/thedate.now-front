import type { ReactNode } from "react";
import ApplicationDocument from "@/components/application-document";
import "./globals.css";
export const metadata = {
  title: "Estudio de bodas — Save the Date",
  robots: { index: false, follow: false },
  icons: { icon: "/wedding-icon.png?v=4" },
};
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <ApplicationDocument product="wedding">{children}</ApplicationDocument>
  );
}
