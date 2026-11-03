import type { FlyerCanvas, FlyerElement } from "@/lib/events/flyer";
import type { InvitationTemplate } from "@/lib/events/template-catalog";
import { templateArt } from "./template-art-direction";
type Placement = Pick<
  FlyerElement,
  "x" | "y" | "width" | "height" | "fontSize" | "align"
>;
type Composition = { height: number; heading: Placement; detail: Placement };
const box = (
  x: number,
  y: number,
  width: number,
  height: number,
  fontSize: number,
  align: Placement["align"] = "center",
): Placement => ({ x, y, width, height, fontSize, align });
const compositions: Record<string, Composition> = {
  botanical: {
    height: 800,
    heading: box(125, 120, 470, 150, 56),
    detail: box(125, 340, 470, 300, 44),
  },
  romance: {
    height: 880,
    heading: box(110, 180, 500, 160, 62),
    detail: box(125, 400, 470, 280, 42),
  },
  gala: {
    height: 800,
    heading: box(100, 140, 520, 125, 46),
    detail: box(90, 340, 540, 280, 58),
  },
  editorial: {
    height: 740,
    heading: box(64, 80, 510, 160, 68, "left"),
    detail: box(180, 340, 476, 280, 44, "left"),
  },
  fiesta: {
    height: 760,
    heading: box(60, 85, 560, 165, 70, "left"),
    detail: box(60, 330, 550, 290, 52, "left"),
  },
  coastal: {
    height: 720,
    heading: box(105, 95, 510, 150, 52),
    detail: box(105, 310, 510, 270, 46),
  },
};
export function collectionInterior(
  canvas: FlyerCanvas,
  template: InvitationTemplate,
  heading: string,
): FlyerCanvas {
  const family = templateArt(template) || "editorial";
  const composition = compositions[family];
  const location = heading === "Ubicación";
  if (!location && heading !== "Fecha y hora") return canvas;
  return {
    ...canvas,
    height: composition.height,
    elements: canvas.elements
      .filter((item) => item.type !== "icon")
      .map((item) => {
        const detail =
          item.binding === "event_date" || item.binding === "location";
        const placement = detail ? composition.detail : composition.heading;
        return {
          ...item,
          ...placement,
          fontSize:
            location && detail
              ? Math.min(placement.fontSize, 36)
              : placement.fontSize,
          lineHeight: detail ? 1.35 : 1.08,
          letterSpacing: family === "gala" && !detail ? 0.08 : 0,
          typeface:
            family === "gala"
              ? "display"
              : family === "fiesta"
                ? "rounded"
                : undefined,
          bold: family === "fiesta" && !detail,
        };
      }),
  };
}
