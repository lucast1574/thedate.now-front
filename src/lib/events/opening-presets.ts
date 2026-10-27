import type { Opening } from "./celebration";
import type { DesignEvent } from "./types";
import { normalizeColor } from "@/lib/ui/color";
export const openingPresets = [
  {
    id: "classic",
    name: "Carta",
    description: "El sello se rompe y la carta se eleva.",
    icon: "mail",
    duration: 1800,
  },
  {
    id: "arch",
    name: "Jardín",
    description: "Un arco botánico abre sus puertas.",
    icon: "leaf",
    duration: 1900,
  },
  {
    id: "ticket",
    name: "Ticket",
    description: "Una entrada especial se separa en dos.",
    icon: "ticket",
    duration: 1600,
  },
  {
    id: "curtain",
    name: "Telón",
    description: "El escenario se descubre entre cortinas.",
    icon: "star",
    duration: 2000,
  },
  {
    id: "bloom",
    name: "Flor",
    description: "Los pétalos se despliegan para recibirte.",
    icon: "flower",
    duration: 1900,
  },
  {
    id: "orbit",
    name: "Constelación",
    description: "Una estrella abre un universo de luz.",
    icon: "sparkle",
    duration: 1800,
  },
] as const;
export function openingPreset(style: Opening["style"]) {
  return openingPresets.find((item) => item.id === style) || openingPresets[0];
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
