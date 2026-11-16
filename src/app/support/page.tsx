import { getTranslator } from "@/lib/i18n/server";
import { applicationProduct } from "@/lib/products/application";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { googleEnabled } from "@/lib/auth/google";
import SupportPage from "@/features/support/support-page";

export async function generateMetadata() {
  const i18n = await getTranslator();
  return {
    title: i18n("Soporte"),
    robots: { index: false, follow: false },
  };
}
export default async function Page() {
  const host = ((await headers()).get("host") ?? "")
    .toLowerCase()
    .split(":")[0];
  if (
    process.env.NODE_ENV === "production" &&
    !["crea.thedate.now", "studio.save.thedate.now"].includes(host)
  )
    notFound();
  return (
    <SupportPage
      wedding={applicationProduct(host) === "wedding"}
      googleEnabled={googleEnabled(host)}
    />
  );
}
