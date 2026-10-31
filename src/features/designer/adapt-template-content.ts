import type { FlyerCanvas } from "@/lib/events/flyer";
import { fitInvitationText } from "@/lib/events/fit-invitation-text";
export function adaptTemplateCanvas(canvas: FlyerCanvas): FlyerCanvas {
  let elements = canvas.elements.map((e) => ({ ...e })),
    height = canvas.height;
  for (const id of [...elements].sort((a, b) => a.y - b.y).map((e) => e.id)) {
    const item = elements.find((e) => e.id === id)!;
    if (
      item.type !== "text" ||
      item.binding === "map" ||
      item.binding === "dress_code"
    )
      continue;
    const fit = fitInvitationText(item),
      min = Math.min(item.fontSize, 22);
    if (fit >= min) {
      item.fontSize = fit;
      continue;
    }
    const oldBottom = item.y + item.height;
    while (fitInvitationText(item) < min && item.height < 1500)
      item.height += 20;
    const grow = item.height - (oldBottom - item.y);
    elements = elements.map((e) =>
      e.id !== id && e.y >= oldBottom - 1 ? { ...e, y: e.y + grow } : e,
    );
    height = Math.max(height, ...elements.map((e) => e.y + e.height + 40));
    item.fontSize = Math.max(8, fitInvitationText(item));
  }
  if (height > 2000)
    return {
      ...canvas,
      elements: canvas.elements.map((e) => ({
        ...e,
        fontSize: fitInvitationText(e),
      })),
    };
  return { ...canvas, height, elements };
}
