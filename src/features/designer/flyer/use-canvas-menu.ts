import { useCallback, useState, type MouseEvent } from "react";
import type { FlyerCanvas } from "@/lib/events/flyer";
import { canvasCommand, type CanvasCommand } from "./canvas-commands";
import type { MenuPosition } from "./canvas-context-menu";
export function useCanvasMenu(
  canvas: FlyerCanvas,
  onChange: (canvas: FlyerCanvas) => void,
  onSelect: (id: string) => void,
) {
  const [menu, setMenu] = useState<MenuPosition | null>(null);
  const [target, setTarget] = useState<HTMLElement | null>(null);
  const close = useCallback(
    (restore = false) => {
      setMenu(null);
      if (restore) target?.focus({ preventScroll: true });
    },
    [target],
  );
  function open(e: MouseEvent<HTMLElement>, id: string) {
    e.preventDefault();
    e.stopPropagation();
    onSelect(id);
    setTarget(e.currentTarget);
    const rect = e.currentTarget.getBoundingClientRect();
    setMenu({
      id,
      x: e.clientX || rect.left + 20,
      y: e.clientY || rect.top + 20,
      general: !!e.currentTarget.closest(".editor-general"),
    });
  }
  function command(action: CanvasCommand) {
    if (!menu) return;
    const id = action === "duplicate" ? crypto.randomUUID() : "";
    onChange(canvasCommand(canvas, menu.id, action, id));
    onSelect(action === "delete" ? "" : id || menu.id);
    close(action !== "delete" && action !== "duplicate");
  }
  return { menu, open, close, command };
}
