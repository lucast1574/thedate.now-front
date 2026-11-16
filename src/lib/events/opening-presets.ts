import {
  type Translator,
  localized,
  spanishTranslator,
} from "@/lib/i18n/translator";
import type { Opening } from "./celebration";
import type { DesignEvent } from "./types";
import { normalizeColor } from "@/lib/ui/color";
export const openingPresets = localized(
  (i18n: Translator) =>
    [
      {
        id: "classic",
        name: i18n("Carta"),
        description: i18n("El sello se rompe y la carta se eleva."),
        icon: "mail",
        duration: 1800,
      },
      {
        id: "arch",
        name: i18n("Jardín"),
        description: i18n("Un arco botánico abre sus puertas."),
        icon: "leaf",
        duration: 1900,
      },
      {
        id: "ticket",
        name: i18n("Ticket"),
        description: i18n("Una entrada especial se separa en dos."),
        icon: "ticket",
        duration: 1600,
      },
      {
        id: "curtain",
        name: i18n("Telón"),
        description: i18n("El escenario se descubre entre cortinas."),
        icon: "star",
        duration: 2000,
      },
      {
        id: "bloom",
        name: i18n("Flor"),
        description: i18n("Los pétalos se despliegan para recibirte."),
        icon: "flower",
        duration: 1900,
      },
      {
        id: "orbit",
        name: i18n("Constelación"),
        description: i18n("Una estrella abre un universo de luz."),
        icon: "sparkle",
        duration: 1800,
      },
    ] as const,
);
export function openingPreset(
  style: Opening["style"],
  i18n: Translator = spanishTranslator,
) {
  return (
    openingPresets(i18n).find((item) => item.id === style) ||
    openingPresets(i18n)[0]
  );
}
function luminance(hex: string) {
  const [r, g, b] = [1, 3, 5].map((n) => {
    const v = parseInt(hex.slice(n, n + 2), 16) / 255;
    return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
export function resolvedOpening(
  event: Pick<DesignEvent, "opening" | "sections" | "accentColor" | "kind">,
  value = event.opening,
) {
  if (!value) return value;
  if (value.paletteMode !== "design") return value;
  const color =
    normalizeColor(event.sections?.[0]?.canvas?.background) ||
    (event.kind === "wedding" ? "#F4EBDF" : "#EDE6FA");
  const accent = normalizeColor(event.accentColor) || "#463466";
  const [a, b] = [luminance(color), luminance(accent)].sort((a, b) => b - a);
  const ink =
    (a + 0.05) / (b + 0.05) >= 4.5
      ? accent
      : luminance(color) > 0.179
        ? "#25242A"
        : "#FFF9ED";
  return { ...value, color, ink };
}
