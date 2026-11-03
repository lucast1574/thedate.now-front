import type { FlyerCanvas, FlyerElement } from "@/lib/events/flyer";
import { ornaments } from "@/lib/events/ornaments";
import { element } from "./flyer/canvas-model";
type Box = { x: number; y: number; width: number; height: number };
export function intersects(a: Box, b: Box, gap = 12) {
  return (
    a.x < b.x + b.width + gap &&
    a.x + a.width + gap > b.x &&
    a.y < b.y + b.height + gap &&
    a.y + a.height + gap > b.y
  );
}
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
  const content = canvas.elements.filter((e) => e.type !== "icon");
  const cover = content.some((e) =>
    ["couple_names", "event_title"].includes(e.binding || ""),
  );
  // Decorations are small, proportional accents occupying genuine negative space.
  // An empty result is intentional for photographic panels; never force a frame over content.
  const sizes = cover ? [220, 170, 110] : [160, 100, 70];
  const art: FlyerElement[] = [];
  const corners = cover
    ? ["top", "bottom"]
    : content.some((e) => e.type === "image")
      ? ["bottom"]
      : ["top"];
  for (const [n, corner] of corners.entries()) {
    for (const size of sizes) {
      const candidates =
        corner === "top"
          ? [
              { x: 24, y: 24 },
              { x: w - size - 24, y: 24 },
              { x: (w - size) / 2, y: 24 },
              ...(!cover ? [{ x: w - size - 24, y: h - size - 24 }] : []),
            ]
          : [
              { x: w - size - 24, y: h - size - 24 },
              { x: 24, y: h - size - 24 },
            ];
      const space = candidates
        .map((p) => ({ ...p, width: size, height: size }))
        .find(
          (box) =>
            ![...content, ...art].some((item) => intersects(box, item, 18)),
        );
      if (!space) continue;
      const drawing = family[n % family.length];
      // Cameos/tickets are library frames, not automatic full-page decorations.
      const icon =
        drawing.id === "cameo"
          ? "ribbon"
          : drawing.id === "ticket"
            ? "orbit"
            : drawing.id;
      art.push(
        element("icon", {
          ...space,
          id: `ornament-${crypto.randomUUID()}`,
          icon: `art:${icon}`,
          color,
          opacity: cover ? 0.8 : 0.65,
          rotation: n && canvas.art === "botanical" ? 180 : 0,
        }),
      );
      break;
    }
  }
  return {
    ...canvas,
    artEditable: true,
    elements: [...art, ...canvas.elements],
  };
}
