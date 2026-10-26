import type { FlyerCanvas, FlyerElement } from "@/lib/events/flyer";
import { clamp } from "./canvas-model";
export type Corner = "nw" | "ne" | "sw" | "se";
export function imagePlacement(
  width: number,
  height: number,
  canvas: FlyerCanvas,
) {
  const ratio = width > 0 && height > 0 ? width / height : 1;
  const w = Math.max(
    16,
    Math.min(canvas.width * 0.75, canvas.height * 0.65 * ratio),
  );
  const h = Math.max(16, w / ratio);
  return {
    width: w,
    height: h,
    x: (canvas.width - w) / 2,
    y: (canvas.height - h) / 2,
  };
}
export function scaleElement(
  item: FlyerElement,
  size: number,
  axis: "width" | "height",
  canvas: FlyerCanvas,
) {
  const max = Math.min(
    (canvas.width - item.x) / item.width,
    (canvas.height - item.y) / item.height,
  );
  const min = Math.max(16 / item.width, 16 / item.height);
  const factor = clamp(size / item[axis], min, Math.max(min, max));
  return { width: item.width * factor, height: item.height * factor };
}
export function resizeCorner(
  item: FlyerElement,
  dx: number,
  dy: number,
  corner: Corner,
  canvas: FlyerCanvas,
) {
  const sx = corner.endsWith("e") ? 1 : -1,
    sy = corner.startsWith("s") ? 1 : -1;
  const angle = (item.rotation * Math.PI) / 180,
    cos = Math.cos(angle),
    sin = Math.sin(angle);
  const lx = dx * cos + dy * sin,
    ly = -dx * sin + dy * cos;
  const proportional = item.type !== "text" || item.locationStyle === "icon";
  let width = Math.max(16, item.width + lx * sx),
    height = Math.max(16, item.height + ly * sy);
  if (proportional) {
    const factor = Math.max(
      16 / item.width,
      16 / item.height,
      1 +
        (lx * sx * item.width + ly * sy * item.height) /
          (item.width ** 2 + item.height ** 2),
    );
    width = item.width * factor;
    height = item.height * factor;
  }
  const cx = ((width - item.width) * sx) / 2;
  const cy = ((height - item.height) * sy) / 2;
  const tx = item.width / 2 + cx * cos - cy * sin - width / 2;
  const ty = item.height / 2 + cx * sin + cy * cos - height / 2;
  const dw = width - item.width,
    dh = height - item.height;
  let travel = 1;
  if (tx < 0) travel = Math.min(travel, item.x / -tx);
  if (ty < 0) travel = Math.min(travel, item.y / -ty);
  if (tx + dw > 0)
    travel = Math.min(travel, (canvas.width - item.x - item.width) / (tx + dw));
  if (ty + dh > 0)
    travel = Math.min(
      travel,
      (canvas.height - item.y - item.height) / (ty + dh),
    );
  travel = Math.max(0, travel);
  return {
    ...item,
    width: item.width + dw * travel,
    height: item.height + dh * travel,
    x: Math.max(0, item.x + tx * travel),
    y: Math.max(0, item.y + ty * travel),
  };
}
export function snapCenter(
  item: FlyerElement,
  canvas: FlyerCanvas,
  tolerance = 6,
) {
  const vertical =
    Math.abs(item.x + item.width / 2 - canvas.width / 2) <= tolerance;
  const horizontal =
    Math.abs(item.y + item.height / 2 - canvas.height / 2) <= tolerance;
  return {
    item: {
      ...item,
      x: vertical ? (canvas.width - item.width) / 2 : item.x,
      y: horizontal ? (canvas.height - item.height) / 2 : item.y,
    },
    vertical,
    horizontal,
  };
}
