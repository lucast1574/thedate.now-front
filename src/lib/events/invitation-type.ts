import {
  type Translator,
  localized,
  spanishTranslator,
} from "@/lib/i18n/translator";
import { flyerFonts, type FlyerElement } from "./flyer";
export const invitationTypefaces = localized(
  (i18n: Translator) =>
    [
      { value: "serif", label: i18n("Cormorant · Editorial"), font: "serif" },
      { value: "sans", label: i18n("Manrope · Contemporánea"), font: "sans" },
      {
        value: "script",
        label: i18n("Italianno · Caligrafía"),
        font: "script",
      },
      { value: "display", label: i18n("Bodoni · Alta costura"), font: "serif" },
      { value: "rounded", label: i18n("Nunito · Celebración"), font: "sans" },
      { value: "humanist", label: i18n("DM Sans · Esencial"), font: "sans" },
      { value: "mono", label: i18n("Monoespaciada · Ticket"), font: "mono" },
    ] as const,
);
export function typefacePatch(
  value: string,
  i18n: Translator = spanishTranslator,
): Partial<FlyerElement> {
  const option = invitationTypefaces(i18n).find((face) => face.value === value);
  if (!option) return {};
  return {
    font: option.font,
    typeface: ["display", "rounded", "humanist"].includes(value)
      ? (value as FlyerElement["typeface"])
      : undefined,
  };
}
export function elementFontFamily(item: FlyerElement) {
  if (item.typeface === "display")
    return "var(--font-wedding-logo, 'Invitation Serif'), Georgia, serif";
  if (item.typeface === "rounded")
    return "var(--font-party, 'Invitation Sans'), sans-serif";
  if (item.typeface === "humanist")
    return "var(--font-sans, 'Invitation Sans'), sans-serif";
  return flyerFonts[item.font];
}
