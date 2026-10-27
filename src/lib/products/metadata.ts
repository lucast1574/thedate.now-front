import "server-only";
import { headers } from "next/headers";
import { applicationProduct, configuredProduct } from "./application";
export async function giftMetadata(personal = false) {
  const product =
    configuredProduct() ||
    applicationProduct(((await headers()).get("host") || "").split(":")[0]);
  return {
    title: `${personal ? "Tu lista" : "Lista"} de regalos — ${product === "wedding" ? "Save the Date" : "The Date"}`,
    robots: { index: false, follow: false },
    referrer: "no-referrer" as const,
  };
}
