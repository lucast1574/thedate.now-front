import type { Kind } from "@/lib/events/types";
import { invitationFromHost } from "@/lib/events/domains";
export function configuredProduct(): Kind | null {
  const value = process.env.APP_PRODUCT;
  if (!value) return null;
  if (value !== "general" && value !== "wedding")
    throw new Error("Invalid application product");
  return value;
}
export function applicationProduct(host: string): Kind {
  host = host.toLowerCase().replace(/:\d+$/, "").replace(/\.$/, "");
  return (
    configuredProduct() ||
    invitationFromHost(host)?.kind ||
    (host === "studio.save.thedate.now" || host === "save.thedate.now"
      ? "wedding"
      : "general")
  );
}
export function applicationHost(product: Kind) {
  return product === "wedding" ? "studio.save.thedate.now" : "crea.thedate.now";
}
