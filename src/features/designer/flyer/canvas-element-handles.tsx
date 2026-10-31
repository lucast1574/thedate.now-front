import Icon from "@/components/icon";
import type { FlyerElement } from "@/lib/events/flyer";
import type { useCanvasGesture } from "./use-canvas-gesture";
export default function CanvasElementHandles({
  original,
  gesture,
}: {
  original: FlyerElement;
  gesture: ReturnType<typeof useCanvasGesture>;
}) {
  return (
    <>
      <button
        type="button"
        className="canvas-handle canvas-rotate"
        aria-label="Rotar elemento"
        onPointerDown={(e) => gesture.begin(e, original, "rotate")}
        onPointerMove={gesture.move}
        onPointerUp={gesture.end}
        onPointerCancel={(e) => gesture.end(e, true)}
      >
        <Icon name="refresh" />
      </button>
      {(["nw", "ne", "sw", "se"] as const).map((corner) => (
        <button
          key={corner}
          type="button"
          className={`canvas-handle canvas-resize corner-${corner}`}
          aria-label="Cambiar tamaño del elemento"
          onPointerDown={(e) => gesture.begin(e, original, `resize-${corner}`)}
          onPointerMove={gesture.move}
          onPointerUp={gesture.end}
          onPointerCancel={(e) => gesture.end(e, true)}
        ></button>
      ))}
    </>
  );
}
