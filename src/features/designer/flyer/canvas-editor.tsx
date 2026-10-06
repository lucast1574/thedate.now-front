import type { KeyboardEvent } from "react";
import type { FlyerCanvas } from "@/lib/events/flyer";
import FlyerSurface, {
  flyerElementStyle,
  FlyerContent,
} from "@/components/flyer-surface";
import { moveElement } from "./canvas-model";
import { useCanvasGesture } from "./use-canvas-gesture";
export default function CanvasEditor({
  canvas,
  selectedId,
  onSelect,
  onChange,
  photoURL,
}: {
  canvas: FlyerCanvas;
  selectedId: string;
  onSelect: (id: string) => void;
  onChange: (canvas: FlyerCanvas) => void;
  photoURL: (key: string) => string;
}) {
  const gesture = useCanvasGesture(canvas, onChange);
  function keyboard(e: KeyboardEvent, id: string) {
    const item = canvas.elements.find((el) => el.id === id)!;
    const keys: Record<string, [number, number]> = {
      ArrowLeft: [-1, 0],
      ArrowRight: [1, 0],
      ArrowUp: [0, -1],
      ArrowDown: [0, 1],
    };
    if (e.key === "Delete" || e.key === "Backspace") {
      e.preventDefault();
      onChange({
        ...canvas,
        elements: canvas.elements.filter((el) => el.id !== id),
      });
      onSelect("");
    } else if (keys[e.key]) {
      e.preventDefault();
      const [dx, dy] = keys[e.key];
      const step = e.shiftKey ? 10 : 1;
      onChange({
        ...canvas,
        elements: canvas.elements.map((el) =>
          el.id === id ? moveElement(item, dx * step, dy * step, canvas) : el,
        ),
      });
    }
  }
  return (
    <div className="canvas-editor" onClick={() => onSelect("")}>
      <FlyerSurface canvas={canvas} photoURL={photoURL} label="Lienzo editable">
        {canvas.elements.map((original, index) => {
          const item =
            gesture.transient?.id === original.id
              ? gesture.transient
              : original;
          const selected = selectedId === item.id;
          return (
            <div
              key={item.id}
              className={`flyer-element canvas-item ${selected ? "is-selected" : ""}`}
              style={flyerElementStyle(item, canvas)}
              role="button"
              tabIndex={0}
              aria-pressed={selected}
              aria-label={`${item.type === "text" ? item.text?.slice(0, 45) || "Texto" : item.type === "image" ? "Imagen" : "Icono"}, capa ${index + 1}`}
              onClick={(e) => {
                e.stopPropagation();
                onSelect(item.id);
              }}
              onFocus={() => onSelect(item.id)}
              onKeyDown={(e) => keyboard(e, item.id)}
              onPointerDown={(e) => {
                onSelect(item.id);
                gesture.begin(e, original);
              }}
              onPointerMove={gesture.move}
              onPointerUp={gesture.end}
              onPointerCancel={(e) => gesture.end(e, true)}
            >
              <FlyerContent item={item} photoURL={photoURL} />
              {selected && (
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
                    ↻
                  </button>
                  <button
                    type="button"
                    className="canvas-handle canvas-resize"
                    aria-label="Cambiar tamaño del elemento"
                    onPointerDown={(e) => gesture.begin(e, original, "resize")}
                    onPointerMove={gesture.move}
                    onPointerUp={gesture.end}
                    onPointerCancel={(e) => gesture.end(e, true)}
                  >
                    ↘
                  </button>
                </>
              )}
            </div>
          );
        })}
      </FlyerSurface>
    </div>
  );
}
