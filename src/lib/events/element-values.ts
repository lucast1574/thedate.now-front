import { type Translator, spanishTranslator } from "@/lib/i18n/translator";
import type { FlyerElement } from "./flyer";
import type { PublicEvent } from "./types";
import { formatEventDate } from "./date";
import { mapCoordinates } from "./map-element";
export function coupleNames(
  event: Partial<PublicEvent>,
  i18n: Translator = spanishTranslator,
) {
  return (
    [event.celebration?.partnerOne, event.celebration?.partnerTwo]
      .filter((name) => name?.trim())
      .join(" y ") ||
    event.title ||
    i18n("Nombres de los novios")
  );
}
function formattedNames(
  event: Partial<PublicEvent>,
  item: FlyerElement,
  i18n: Translator = spanishTranslator,
) {
  const names = coupleNames(event, i18n);
  const parts =
    event.celebration?.partnerOne && event.celebration?.partnerTwo
      ? [event.celebration.partnerOne, event.celebration.partnerTwo]
      : names.split(/\s+(?:y|&)\s+/i);
  if (item.nameFormat === "initials")
    return parts
      .map((name) => name.trim()[0])
      .filter(Boolean)
      .join(" & ");
  if (item.nameFormat === "stacked") return parts.join("\ny\n");
  return item.nameFormat === "uppercase"
    ? names.toLocaleUpperCase("es")
    : names;
}
export function elementValue(
  item: FlyerElement,
  event?: Partial<PublicEvent>,
  i18n: Translator = spanishTranslator,
): FlyerElement {
  if (!event || !item.eventBound) return item;
  const details = event.celebration;
  switch (item.binding) {
    case "couple_names":
      return {
        ...item,
        text: item.text?.includes("{{novios}}")
          ? item.text.replaceAll(
              "{{novios}}",
              formattedNames(event, item, i18n),
            )
          : formattedNames(event, item, i18n),
      };
    case "event_title":
      return {
        ...item,
        text: item.text?.includes("{{evento}}")
          ? item.text.replaceAll(
              "{{evento}}",
              event.title || i18n("Tu celebración"),
            )
          : event.title || i18n("Tu celebración"),
      };
    case "event_date":
      return {
        ...item,
        text: item.text?.includes("{{fecha_hora}}")
          ? item.text.replaceAll(
              "{{fecha_hora}}",
              formatEventDate(event.startAt || "", event.timeZone, i18n),
            )
          : formatEventDate(event.startAt || "", event.timeZone, i18n),
      };
    case "location":
      return {
        ...item,
        address: event.location || item.address,
        link: event.isVirtual ? event.virtualUrl : event.mapUrl,
      };
    case "map":
      return {
        ...item,
        ...mapCoordinates(event.mapUrl),
        ...(details?.mapLatitude !== undefined &&
        details?.mapLongitude !== undefined
          ? {
              mapLatitude: details.mapLatitude,
              mapLongitude: details.mapLongitude,
            }
          : {}),
      };
    case "dress_code":
      return {
        ...item,
        text: details
          ? [details.dressCode, details.dressNote].filter(Boolean).join("\n")
          : item.text,
        dressExcludedColors:
          details?.dressExcludedColors || item.dressExcludedColors,
      };
    case "restrictions":
      return {
        ...item,
        text: details?.restrictionText || "",
        restrictionIcon: details?.restrictionIcon || item.restrictionIcon,
      };
    case "adults_notice":
      return {
        ...item,
        text: details?.adultsOnly ? details.adultsMessage : "",
      };
    default:
      return item;
  }
}
