import { useRef, useState, type PointerEvent } from "react";
import type { FlyerCanvas, FlyerElement } from "@/lib/events/flyer";
import { clamp, moveElement } from "./canvas-model";
import { resizeCorner, snapCenter, type Corner } from "./canvas-geometry";
type Gesture = {
  startX: number;
  startY: number;
  scale: number;
  item: FlyerElement;
  action: "move" | "rotate" | `resize-${Corner}`;
  centerX: number;
  centerY: number;
  angle: number;
  latest: FlyerElement;
};
export function useCanvasGesture(
  canvas: FlyerCanvas,
  onChange: (canvas: FlyerCanvas) => void,
) {
  const gesture = useRef<Gesture | null>(null);
  const dragged = useRef(false);
  const [transient, setTransient] = useState<FlyerElement | null>(null);
  function begin(
    e: PointerEvent<HTMLElement>,
    item: FlyerElement,
    action: Gesture["action"] = "move",
  ) {
    if (e.button !== 0) return;
    dragged.current = false;
    e.preventDefault();
    e.stopPropagation();
    const surface = e.currentTarget
      .closest(".flyer-surface")!
      .getBoundingClientRect();
    const scale = canvas.width / surface.width;
    const centerX = surface.left + (item.x + item.width / 2) / scale;
    const centerY = surface.top + (item.y + item.height / 2) / scale;
    gesture.current = {
      startX: e.clientX,
      startY: e.clientY,
      scale,
      item,
      action,
      centerX,
      centerY,
      angle: Math.atan2(e.clientY - centerY, e.clientX - centerX),
      latest: item,
    };
    e.currentTarget.setPointerCapture(e.pointerId);
  }
  function move(e: PointerEvent<HTMLElement>) {
    const g = gesture.current;
    if (!g) return;
    if (Math.hypot(e.clientX - g.startX, e.clientY - g.startY) > 5)
      dragged.current = true;
    const dx = (e.clientX - g.startX) * g.scale;
    const dy = (e.clientY - g.startY) * g.scale;
    let next = moveElement(g.item, dx, dy, canvas);
    if (g.action.startsWith("resize-"))
      next = resizeCorner(g.item, dx, dy, g.action.slice(7) as Corner, canvas);
    if (g.action === "move" && !e.altKey)
      next = snapCenter(next, canvas, 6 * g.scale).item;
    if (g.action === "rotate") {
      const degrees =
        g.item.rotation +
        ((Math.atan2(e.clientY - g.centerY, e.clientX - g.centerX) - g.angle) *
          180) /
          Math.PI;
      next = {
        ...g.item,
        rotation: clamp(Math.round(((degrees + 540) % 360) - 180), -180, 180),
      };
    }
    g.latest = next;
    setTransient(next);
  }
  function end(e: PointerEvent<HTMLElement>, cancel = false) {
    const g = gesture.current;
    if (!g) return;
    gesture.current = null;
    setTransient(null);
    if (!cancel)
      onChange({
        ...canvas,
        elements: canvas.elements.map((item) =>
          item.id === g.item.id ? g.latest : item,
        ),
      });
    if (e.currentTarget.hasPointerCapture(e.pointerId))
      e.currentTarget.releasePointerCapture(e.pointerId);
  }
  return { transient, begin, move, end, wasDragged: () => dragged.current };
}
