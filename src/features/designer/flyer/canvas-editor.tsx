import type { BackgroundSlice } from "@/lib/events/background";
import { useImageReplacement } from "./use-image-replacement";
import CanvasContextMenu from "./canvas-context-menu";
import { useCanvasMenu } from "./use-canvas-menu";
import { snapCenter } from "./canvas-geometry";
import Icon from "@/components/icon";
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
  onReplace,
  backgroundSlice,
}: {
  canvas: FlyerCanvas;
  backgroundSlice?: BackgroundSlice;
  selectedId: string;
  onSelect: (id: string) => void;
  onChange: (canvas: FlyerCanvas) => void;
  photoURL: (key: string) => string;
  onReplace?: (file: File, id: string) => Promise<void>;
}) {
  const gesture = useCanvasGesture(canvas, onChange);
  const replacement = useImageReplacement(onReplace);
  const context = useCanvasMenu(canvas, onChange, onSelect);
  const moving = gesture.transient;
  const candidate =
    moving || canvas.elements.find((item) => item.id === selectedId);
  const guides = candidate ? snapCenter(candidate, canvas, 0.1) : null;
  function keyboard(e: KeyboardEvent, id: string) {
    if (e.key === "Escape") {
      e.stopPropagation();
      onSelect("");
      return;
    }
    const item = canvas.elements.find((el) => el.id === id)!;
    const keys: Record<string, [number, number]> = {
      ArrowLeft: [-1, 0],
      ArrowRight: [1, 0],
      ArrowUp: [0, -1],
      ArrowDown: [0, 1],
    };
    if (e.key === "Delete" || e.key === "Backspace") {
      e.preventDefault();
      e.stopPropagation();
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
      {replacement.input}
      <FlyerSurface
        canvas={canvas}
        photoURL={photoURL}
        backgroundSlice={backgroundSlice}
        label="Lienzo editable"
      >
        {moving && guides?.vertical && (
          <div className="canvas-guide is-vertical" aria-hidden="true" />
        )}
        {moving && guides?.horizontal && (
          <div className="canvas-guide is-horizontal" aria-hidden="true" />
        )}
        {guides && (guides.vertical || guides.horizontal) && (
          <span className="canvas-center-label">Centrado</span>
        )}
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
              aria-label={`${item.binding === "guest_name" ? "Nombre del invitado" : item.binding === "location" ? "Ubicación" : item.type === "text" ? item.text?.slice(0, 45) || "Texto" : item.type === "image" ? "Imagen" : "Símbolo"}, capa ${index + 1}`}
              data-photo={item.type === "image" || undefined}
              onClick={(e) => {
                e.stopPropagation();
                if ((e.target as HTMLElement).closest("a")) e.preventDefault();
                onSelect(item.id);
                const imageTarget =
                  item.type === "image" ||
                  (item.binding === "dress_code" &&
                    (e.target as HTMLElement).closest("[data-dress-image]"));
                if (
                  imageTarget &&
                  !gesture.wasDragged() &&
                  !(e.target as HTMLElement).closest(".canvas-handle")
                )
                  replacement.request(item.id);
              }}
              onFocus={() => onSelect(item.id)}
              onKeyDown={(e) => {
                if (
                  item.type === "image" &&
                  (e.key === "Enter" || e.key === " ")
                ) {
                  e.preventDefault();
                  replacement.request(item.id);
                } else keyboard(e, item.id);
              }}
              onContextMenu={(e) => context.open(e, item.id)}
              onPointerDown={(e) => {
                if (e.button !== 0) return;
                e.currentTarget.focus({ preventScroll: true });
                onSelect(item.id);
                gesture.begin(e, original);
              }}
              onPointerMove={gesture.move}
              onPointerUp={gesture.end}
              onPointerCancel={(e) => gesture.end(e, true)}
            >
              <FlyerContent item={item} photoURL={photoURL} />
              {item.type === "image" && (
                <span className="canvas-photo-hint">
                  <Icon name="image" /> Pulsa para cambiar foto
                </span>
              )}
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
                    <Icon name="refresh" />
                  </button>
                  {(["nw", "ne", "sw", "se"] as const).map((corner) => (
                    <button
                      key={corner}
                      type="button"
                      className={`canvas-handle canvas-resize corner-${corner}`}
                      aria-label="Cambiar tamaño del elemento"
                      onPointerDown={(e) =>
                        gesture.begin(e, original, `resize-${corner}`)
                      }
                      onPointerMove={gesture.move}
                      onPointerUp={gesture.end}
                      onPointerCancel={(e) => gesture.end(e, true)}
                    ></button>
                  ))}
                </>
              )}
            </div>
          );
        })}
      </FlyerSurface>
      {context.menu && (
        <CanvasContextMenu
          position={context.menu}
          onCommand={context.command}
          onClose={context.close}
        />
      )}
    </div>
  );
}
