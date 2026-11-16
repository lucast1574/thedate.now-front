import { getTranslator } from "@/lib/i18n/server";
import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";
import ApplicationDocument from "@/components/application-document";
import { applicationProduct } from "@/lib/products/application";
import {
  shareEvent,
  shareMetadata,
} from "@/features/invitations/share-metadata";
export async function generateMetadata(): Promise<Metadata> {
  const i18n = await getTranslator();

  const host = ((await headers()).get("host") ?? "")
    .toLowerCase()
    .replace(/:\d+$/, "")
    .replace(/\.$/, "");
  const wedding = applicationProduct(host) === "wedding";
  const event = await shareEvent(host);
  if (event) return shareMetadata(event, i18n);
  return {
    title:
      host === "studio.save.thedate.now"
        ? i18n("Estudio de bodas — Save the Date")
        : host === "crea.thedate.now"
          ? i18n("Mi espacio — The Date")
          : wedding
            ? i18n("Save the Date — Invitaciones de boda")
            : i18n("The Date — Invitaciones para eventos"),
    description: wedding
      ? i18n(
          "Diseñen su invitación de boda y organicen los detalles de su celebración.",
        )
      : i18n("Crea invitaciones digitales y organiza tus eventos."),
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
