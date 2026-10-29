import type { FlyerElement } from "./flyer";
export function mapCoordinates(link = "") {
  let value = link;
  try {
    value = decodeURIComponent(link);
  } catch {
    /* Keep the original URL. */
  }
  const match =
    value.match(/!3d(-?\d+(?:\.\d+)?)!4d(-?\d+(?:\.\d+)?)/) ||
    value.match(
      /(?:@|[?&](?:mlat|q|query|ll|center)=)(-?\d+(?:\.\d+)?)[,&](-?\d+(?:\.\d+)?)/,
    );
  if (!match) return {};
  const mapLatitude = Number(match[1]),
    mapLongitude = Number(match[2]);
  return Math.abs(mapLatitude) <= 85 && Math.abs(mapLongitude) <= 180
    ? { mapLatitude, mapLongitude }
    : {};
}
export function validMapCoordinates(item: FlyerElement) {
  return (
    typeof item.mapLatitude === "number" &&
    Number.isFinite(item.mapLatitude) &&
    Math.abs(item.mapLatitude) <= 85 &&
    typeof item.mapLongitude === "number" &&
    Number.isFinite(item.mapLongitude) &&
    Math.abs(item.mapLongitude) <= 180
  );
}
