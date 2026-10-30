import type { FlyerElement } from "./flyer";
const labels: Record<NonNullable<FlyerElement["binding"]>, string> = {
  guest_name: "Nombre del invitado",
  couple_names: "Nombres de los novios",
  event_title: "Nombre del evento",
  event_date: "Fecha y hora",
  map: "Mapa",
  location: "Ubicación",
  dress_code: "Dress code",
  restrictions: "Restricciones",
  adults_notice: "Solo adultos",
  calendar_link: "Añadir al calendario",
  gift_link: "Lista de regalos",
};
export function elementLabel(item: FlyerElement) {
  return item.binding
    ? labels[item.binding]
    : item.type === "image"
      ? "Imagen"
      : item.type === "icon"
        ? "Símbolo"
        : "Texto";
}
