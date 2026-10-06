import type { FlyerElement } from "./flyer";
export const guestNameToken = "{{nombre_invitado}}";
export function personalizedText(item: FlyerElement, name?: string) {
  const text = item.text || "";
  return item.binding === "guest_name"
    ? text.replaceAll(guestNameToken, () => name?.trim() || "Invitado/a")
    : text;
}
export function guestNameElement(accent: string, id: string): FlyerElement {
  return {
    id,
    type: "text",
    binding: "guest_name",
    text: "Hola, {{nombre_invitado}}",
    x: 0,
    y: 40,
    width: 720,
    height: 160,
    rotation: 0,
    color: accent,
    font: "serif",
    fontSize: 48,
    bold: false,
    align: "center",
  };
}
