import type { DesignEvent } from "./types";
export const restrictionExamples = [
  {
    label: "Solo adultos",
    icon: "lucide:baby",
    text: "Celebraremos este día solo entre adultos. Gracias por tu comprensión.",
  },
  {
    label: "Sin mascotas",
    icon: "lucide:paw-print",
    text: "El lugar de la celebración no admite mascotas. Gracias por tenerlo en cuenta.",
  },
  {
    label: "Sin acompañantes",
    icon: "lucide:user-round-x",
    text: "La invitación es personal. Te pedimos respetar los cupos asignados.",
  },
  {
    label: "Sin fotografías",
    icon: "lucide:camera-off",
    text: "Te invitamos a vivir este momento sin tomar fotografías durante la ceremonia.",
  },
] as const;

export function restrictionDefaults(draft: DesignEvent, includeAdults = true) {
  const details = draft.celebration;
  const previous = draft.sections
    ?.flatMap((section) => section.canvas?.elements || [])
    .find((item) => item.binding === "restrictions");
  const text = details?.restrictionText?.trim();
  const adult =
    includeAdults && details?.adultsOnly
      ? details.adultsMessage.trim() ||
        "Celebraremos este día solo entre adultos. Gracias por tu comprensión."
      : "";
  return {
    text:
      [adult, text].filter(Boolean).join("\n\n") ||
      previous?.text ||
      "Ten en cuenta estas indicaciones antes de asistir.",
    restrictionIcon:
      details?.restrictionIcon ||
      (adult && !text ? "lucide:baby" : previous?.restrictionIcon) ||
      "lucide:shield-alert",
  };
}

export function toggleRestrictionSuggestion(
  current: string,
  suggestion: string,
) {
  return current.includes(suggestion)
    ? current
        .replace(suggestion, "")
        .replace(/\n[ \t]*\n(?:[ \t]*\n)+/g, "\n\n")
        .trim()
    : [current.trim(), suggestion].filter(Boolean).join("\n\n");
}
