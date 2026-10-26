import type { FlyerElement } from "./flyer";
export function validMapLink(raw: string) {
  try {
    const u = new URL(raw);
    if (u.protocol !== "https:" || u.username || u.password || u.port)
      return false;
    if (["maps.app.goo.gl", "share.google"].includes(u.hostname))
      return u.pathname.length > 1;
    if (u.hostname === "goo.gl") return u.pathname.startsWith("/maps/");
    if (u.hostname === "g.co") return /^\/(kgs|maps)\//.test(u.pathname);
    return (
      u.hostname === "maps.google.com" ||
      (["google.com", "www.google.com"].includes(u.hostname) &&
        u.pathname.startsWith("/maps"))
    );
  } catch {
    return false;
  }
}
export function locationHref(item: FlyerElement) {
  if (item.link && validMapLink(item.link)) return item.link;
  return item.address?.trim()
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(item.address.trim())}`
    : "";
}
