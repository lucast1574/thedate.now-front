import type { Event } from "./types";
export function defaultDemoCover(event: Event) {
  return Boolean(
    event.isDemo &&
    event.title ===
      (event.kind === "wedding"
        ? "Nuestra historia"
        : "Una celebración inolvidable") &&
    event.description ===
      "Edita esta invitación de muestra para probar tu estilo." &&
    event.template === "classic" &&
    (!event.templateId || event.templateId === `${event.kind}-classic`) &&
    (!event.designMode || event.designMode === "sections") &&
    event.accentColor === "#ad7254" &&
    !event.sections?.length &&
    !event.photoKeys?.length,
  );
}
export function thumbnailFit(
  width: number,
  height: number,
  contentHeight: number,
) {
  const scale = Math.min(width / 390, height / Math.max(1, contentHeight));
  return { scale, left: (width - 390 * scale) / 2 };
}
