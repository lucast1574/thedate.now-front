import type { Kind } from "./types";
const reserved = new Set([
  "www",
  "api",
  "app",
  "admin",
  "backoffice",
  "crea",
  "studio",
  "save",
  "mail",
  "static",
  "assets",
  "support",
]);
export function invitationFromHost(
  raw: string,
): { kind: Kind; slug: string } | null {
  const host = raw.toLowerCase().replace(/:\d+$/, "").replace(/\.$/, "");
  const match = host.match(
    /^([a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)\.(save\.)?thedate\.now$/,
  );
  if (!match || reserved.has(match[1]) || match[1].includes("--")) return null;
  return { kind: match[2] ? "wedding" : "general", slug: match[1] };
}
export function invitationHost(kind: Kind, slug: string) {
  return `${slug}.${kind === "wedding" ? "save." : ""}thedate.now`;
}
export function studioURL(kind: Kind) {
  return kind === "wedding"
    ? "https://studio.save.thedate.now"
    : "https://crea.thedate.now";
}
