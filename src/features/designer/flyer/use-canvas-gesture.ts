import { useRef, useState, type PointerEvent } from "react";
import type { FlyerCanvas, FlyerElement } from "@/lib/events/flyer";
import { clamp, moveElement, resizeElement } from "./canvas-model";
type Gesture = {
  startX: number;
  startY: number;
  scale: number;
  item: FlyerElement;
  action: "move" | "resize" | "rotate";
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
  const [transient, setTransient] = useState<FlyerElement | null>(null);
  function begin(
    e: PointerEvent<HTMLElement>,
    item: FlyerElement,
    action: Gesture["action"] = "move",
  ) {
    if (e.button !== 0) return;
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
    const dx = (e.clientX - g.startX) * g.scale;
    const dy = (e.clientY - g.startY) * g.scale;
    let next = moveElement(g.item, dx, dy, canvas);
    if (g.action === "resize") {
      const angle = (g.item.rotation * Math.PI) / 180;
      next = resizeElement(
        g.item,
        g.item.width + dx * Math.cos(angle) + dy * Math.sin(angle),
        g.item.height - dx * Math.sin(angle) + dy * Math.cos(angle),
        canvas,
      );
    }
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
  return { transient, begin, move, end };
}
