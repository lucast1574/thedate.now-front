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

export type LocationPart = "icon" | "label" | "address";
export const locationStyles: Record<
  NonNullable<FlyerElement["locationStyle"]>,
  readonly LocationPart[]
> = {
  icon: ["icon"],
  label: ["label"],
  address: ["address"],
  "icon-label": ["icon", "label"],
  "icon-address": ["icon", "address"],
  "label-address": ["label", "address"],
  all: ["icon", "label", "address"],
};
export function locationParts(style: FlyerElement["locationStyle"]) {
  return locationStyles[style || "address"] || locationStyles.address;
}
export function toggleLocationPart(
  style: FlyerElement["locationStyle"],
  part: LocationPart,
): NonNullable<FlyerElement["locationStyle"]> {
  const parts = locationParts(style),
    next = parts.includes(part)
      ? parts.filter((value) => value !== part)
      : [...parts, part];
  return (
    (
      Object.keys(locationStyles) as NonNullable<
        FlyerElement["locationStyle"]
      >[]
    ).find(
      (key) =>
        locationStyles[key].length === next.length &&
        next.every((value) => locationStyles[key].includes(value)),
    ) ||
    style ||
    "address"
  );
}
