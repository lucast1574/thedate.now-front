import { flyerFonts, type FlyerElement } from "./flyer";
export const invitationTypefaces = [
  { value: "serif", label: "Cormorant · Editorial", font: "serif" },
  { value: "sans", label: "Manrope · Contemporánea", font: "sans" },
  { value: "script", label: "Italianno · Caligrafía", font: "script" },
  { value: "display", label: "Bodoni · Alta costura", font: "serif" },
  { value: "rounded", label: "Nunito · Celebración", font: "sans" },
  { value: "humanist", label: "DM Sans · Esencial", font: "sans" },
  { value: "mono", label: "Monoespaciada · Ticket", font: "mono" },
] as const;
export function typefacePatch(value: string): Partial<FlyerElement> {
  const option = invitationTypefaces.find((face) => face.value === value);
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
