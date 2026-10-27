import type { FlyerElement } from "./flyer";
export function validGiftLink(raw: string) {
  if (raw === "/regalos") return true;
  if (!raw || raw.length > 2048 || /[\s\\]/.test(raw)) return false;
  try {
    const u = new URL(raw);
    return (
      u.protocol === "https:" && !!u.hostname && !u.username && !u.password
    );
  } catch {
    return false;
  }
}
export function giftHref(item: FlyerElement, personalURL = "/regalos") {
  if (!item.link || !validGiftLink(item.link)) return "";
  return item.link === "/regalos" ? personalURL : item.link;
}
