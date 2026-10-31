import type { FlyerElement } from "@/lib/events/flyer";
import { defaultCelebration } from "@/lib/events/celebration";
import type { DesignEvent } from "@/lib/events/types";

export function directTextMode(item: FlyerElement) {
  if (item.type !== "text") return null;
  if (item.eventBound) {
    if (item.binding === "couple_names") return "names";
    if (item.binding === "event_title") return "title";
    return null;
  }
  return !item.binding ||
    ["couple_names", "event_title", "event_date"].includes(item.binding)
    ? "text"
    : null;
}

export function directTextChange(
  item: FlyerElement,
  event: Partial<DesignEvent>,
  text: string,
  second = "",
) {
  const mode = directTextMode(item);
  if (mode === "title") {
    if (text.trim().length < 2 || text.length > 160)
      throw new Error("Escribe un nombre de entre 2 y 160 caracteres.");
    return { event: { title: text.trim() }, element: undefined };
  }
  if (mode === "names") {
    if (
      !text.trim() ||
      !second.trim() ||
      text.length > 120 ||
      second.length > 120
    )
      throw new Error(
        "Completa ambos nombres, con un máximo de 120 caracteres cada uno.",
      );
    return {
      event: {
        celebration: {
          ...defaultCelebration(true),
          ...event.celebration,
          partnerOne: text.trim(),
          partnerTwo: second.trim(),
        },
      },
      element: undefined,
    };
  }
  if (mode === "text")
    return { element: { text: text.slice(0, 2000) }, event: undefined };
  throw new Error("Este elemento se edita desde su panel de propiedades.");
}
