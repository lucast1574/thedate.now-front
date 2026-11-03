import type { FlyerCanvas } from "@/lib/events/flyer";
import { ornaments } from "@/lib/events/ornaments";
import { element } from "./flyer/canvas-model";
export function editableOrnaments(
  canvas: FlyerCanvas,
  ink?: string,
): FlyerCanvas {
  if (!canvas.art || canvas.artEditable || canvas.elements.length > 57)
    return canvas;
  const family = ornaments.filter((item) => item.family === canvas.art);
  const color =
    ink ||
    canvas.elements.find((item) => item.type === "text")?.color ||
    "#655440";
  const w = canvas.width,
    h = canvas.height;
  const cover = canvas.elements.some((item) =>
    ["couple_names", "event_title"].includes(item.binding || ""),
  );
  const arrangements: Record<
    string,
    [number, number, number, number, number][]
  > = {
    botanical: [
      [0, 10, 10, 200, 270],
      [1, w - 160, h - 230, 150, 220],
    ],
    romance: [
      [0, w / 2 - 75, 24, 150, 150],
      [1, 28, 24, w - 56, h - 48],
    ],
    gala: [
      [0, 16, 30, 130, 155],
      [0, w - 146, 30, 130, 155],
    ],
    editorial: [
      [0, w - 132, 26, 100, 100],
      [1, w - 200, h - 135, 170, 100],
    ],
    fiesta: [
      [0, w - 205, 12, 190, 190],
      [1, 6, h - 225, 180, 210],
    ],
    coastal: [
      [0, w / 2 - 55, 12, 110, 110],
      [1, 20, h - 105, w - 40, 85],
    ],
  };
  const art = arrangements[canvas.art].map(([index, x, y, width, height], n) =>
    element("icon", {
      id: `ornament-${crypto.randomUUID()}`,
      icon: `art:${family[index].id}`,
      x,
      y,
      width,
      height,
      rotation: canvas.art === "botanical" && n === 1 ? 180 : 0,
      color,
      opacity: cover ? 0.7 : 0.4,
    }),
  );
  return {
    ...canvas,
    artEditable: true,
    elements: [...art, ...canvas.elements],
  };
}
