import { useEffect } from "react";
import type { FlyerCanvas } from "@/lib/events/flyer";
import { canvasCommand, isTextTarget } from "./canvas-commands";
export function useCanvasShortcuts(
  canvas: FlyerCanvas,
  selectedId: string,
  change: (canvas: FlyerCanvas) => void,
  select: (id: string) => void,
) {
  useEffect(() => {
    function key(e: KeyboardEvent) {
      if (
        !selectedId ||
        e.defaultPrevented ||
        isTextTarget(e.target) ||
        document.querySelector('[aria-modal="true"]')
      )
        return;
      if (e.key !== "Delete" && e.key !== "Backspace") return;
      e.preventDefault();
      change(canvasCommand(canvas, selectedId, "delete"));
      select("");
    }
    document.addEventListener("keydown", key);
    return () => document.removeEventListener("keydown", key);
  }, [canvas, selectedId, change, select]);
}
