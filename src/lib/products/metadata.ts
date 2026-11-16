import { type Translator, spanishTranslator } from "@/lib/i18n/translator";
import "server-only";
import { headers } from "next/headers";
import { applicationProduct, configuredProduct } from "./application";
export async function giftMetadata(
  personal = false,
  i18n: Translator = spanishTranslator,
) {
  const product =
    configuredProduct() ||
    applicationProduct(((await headers()).get("host") || "").split(":")[0]);
  return {
    title: i18n("{v0} de regalos — {v1}", {
      v0: personal ? i18n("Tu lista") : i18n("Lista"),
      v1: product === "wedding" ? "Save the Date" : "The Date",
    }),
    robots: { index: false, follow: false },
    referrer: "no-referrer" as const,
  };
}
