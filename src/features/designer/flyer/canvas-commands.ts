import type { FlyerCanvas } from "@/lib/events/flyer";
export type CanvasCommand =
  | "delete"
  | "duplicate"
  | "front"
  | "back"
  | "forward"
  | "backward"
  | "center-x"
  | "center-y";
export function canvasCommand(
  canvas: FlyerCanvas,
  id: string,
  command: CanvasCommand,
  newId = "",
) {
  const index = canvas.elements.findIndex((item) => item.id === id);
  if (index < 0) return canvas;
  const elements = [...canvas.elements],
    item = elements[index];
  if (command === "delete") elements.splice(index, 1);
  else if (command === "duplicate") {
    if (elements.length >= 60 || !newId) return canvas;
    elements.splice(index + 1, 0, {
      ...item,
      id: newId,
      x: Math.min(item.x + 16, canvas.width - item.width),
      y: Math.min(item.y + 16, canvas.height - item.height),
    });
  } else if (command.startsWith("center")) {
    elements[index] = {
      ...item,
      ...(command === "center-x"
        ? { x: (canvas.width - item.width) / 2 }
        : { y: (canvas.height - item.height) / 2 }),
    };
  } else {
    const target =
      command === "front"
        ? elements.length - 1
        : command === "back"
          ? 0
          : command === "forward"
            ? Math.min(elements.length - 1, index + 1)
            : Math.max(0, index - 1);
    elements.splice(index, 1);
    elements.splice(target, 0, item);
  }
  return { ...canvas, elements };
}
export function isTextTarget(target: EventTarget | null) {
  return (
    target instanceof HTMLElement &&
    !!target.closest("input,textarea,select,[contenteditable=true],[role=menu]")
  );
}
