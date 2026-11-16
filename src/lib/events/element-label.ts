import {
  type Translator,
  localized,
  spanishTranslator,
} from "@/lib/i18n/translator";
import { ornamentById } from "./ornaments";
import type { FlyerElement } from "./flyer";
const labels = localized(
  (i18n: Translator): Record<NonNullable<FlyerElement["binding"]>, string> => ({
    guest_name: i18n("Nombre del invitado"),
    couple_names: i18n("Nombres de los novios"),
    event_title: i18n("Nombre del evento"),
    event_date: i18n("Fecha y hora"),
    map: i18n("Mapa"),
    location: i18n("Ubicación"),
    dress_code: i18n("Dress code"),
    restrictions: i18n("Restricciones"),
    adults_notice: i18n("Solo adultos"),
    calendar_link: i18n("Añadir al calendario"),
    rsvp_link: i18n("Confirmación de asistencia"),
    gift_link: i18n("Lista de regalos"),
  }),
);
export function elementLabel(
  item: FlyerElement,
  i18n: Translator = spanishTranslator,
) {
  const ornament = ornamentById(item.icon, i18n);
  if (ornament) return ornament.name;
  return item.binding
    ? labels(i18n)[item.binding]
    : item.type === "image"
      ? i18n("Imagen")
      : item.type === "icon"
        ? i18n("Símbolo")
        : i18n("Texto");
}
