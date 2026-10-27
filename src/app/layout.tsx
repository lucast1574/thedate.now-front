import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";
import ApplicationDocument from "@/components/application-document";
import { applicationProduct } from "@/lib/products/application";
export async function generateMetadata(): Promise<Metadata> {
  const host = ((await headers()).get("host") ?? "")
    .toLowerCase()
    .replace(/:\d+$/, "")
    .replace(/\.$/, "");
  const wedding = applicationProduct(host) === "wedding";
  return {
    title:
      host === "studio.save.thedate.now"
        ? "Estudio de bodas — Save the Date"
        : host === "crea.thedate.now"
          ? "Mi espacio — The Date"
          : wedding
            ? "Save the Date — Invitaciones de boda"
            : "The Date — Invitaciones para eventos",
    description: wedding
      ? "Diseñen su invitación de boda y organicen los detalles de su celebración."
      : "Crea invitaciones digitales y organiza tus eventos.",
    icons: { icon: wedding ? "/wedding-icon.png?v=4" : "/event-icon.png?v=2" },
    robots: { index: false, follow: false },
  };
}
export default async function RootLayout({ children }: LayoutProps<"/">) {
  const host = ((await headers()).get("host") || "").split(":")[0];
  return (
    <ApplicationDocument product={applicationProduct(host)}>
      {children}
    </ApplicationDocument>
  );
}
