import type { KeyboardEvent } from "react";
import type { DesignEvent } from "@/lib/events/types";
import type { FlyerCanvas, FlyerElement } from "@/lib/events/flyer";
import { flyerElementStyle, FlyerContent } from "@/components/flyer-surface";
import Icon from "@/components/icon";
import { moveElement } from "./canvas-model";
import type { useCanvasGesture } from "./use-canvas-gesture";
import type { useImageReplacement } from "./use-image-replacement";
import type { useCanvasMenu } from "./use-canvas-menu";
import CanvasElementHandles from "./canvas-element-handles";
import InlineTextEditor from "./inline-text-editor";
import { directTextMode } from "./direct-text";
export default function CanvasItem({
  item,
  original,
  index,
  selected,
  canvas,
  event,
  photoURL,
  gesture,
  replacement,
  context,
  onSelect,
  onChange,
  editing,
  onEdit,
  onEventChange,
}: {
  item: FlyerElement;
  original: FlyerElement;
  index: number;
  selected: boolean;
  canvas: FlyerCanvas;
  event?: Partial<DesignEvent>;
  photoURL: (key: string) => string;
  gesture: ReturnType<typeof useCanvasGesture>;
  replacement: ReturnType<typeof useImageReplacement>;
  context: ReturnType<typeof useCanvasMenu>;
  onSelect: (id: string) => void;
  onChange: (canvas: FlyerCanvas) => void;
  editing: boolean;
  onEdit: (id: string) => void;
  onEventChange?: (patch: Partial<DesignEvent>) => void;
}) {
  const editable =
    !!directTextMode(item) && (!item.eventBound || !!onEventChange);
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
    <div
      key={item.id}
      className={`flyer-element canvas-item ${selected ? "is-selected" : ""}`}
      style={flyerElementStyle(item, canvas)}
      role={editing ? "group" : "button"}
      tabIndex={editing ? -1 : 0}
      aria-pressed={editing ? undefined : selected}
      title={editable ? "Doble clic o Enter para editar" : undefined}
      aria-label={`${item.binding === "map" ? "Mapa" : item.binding === "couple_names" ? "Nombres de los novios" : item.binding === "event_title" ? "Nombre del evento" : item.binding === "event_date" ? "Fecha y hora" : item.binding === "guest_name" ? "Nombre del invitado" : item.binding === "location" ? "Ubicación" : item.type === "text" ? item.text?.slice(0, 45) || "Texto" : item.type === "image" ? "Imagen" : "Símbolo"}, capa ${index + 1}`}
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
      onDoubleClick={(e) => {
        if (editable) {
          e.preventDefault();
          e.stopPropagation();
          onEdit(item.id);
        }
      }}
      onKeyDown={(e) => {
        if (editing) return;
        if (editable && e.key === "Enter") {
          e.preventDefault();
          e.stopPropagation();
          onEdit(item.id);
          return;
        }
        if (item.type === "image" && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          replacement.request(item.id);
        } else keyboard(e, item.id);
      }}
      onContextMenu={(e) => context.open(e, item.id)}
      onPointerDown={(e) => {
        if (
          e.button !== 0 ||
          editing ||
          (e.target as HTMLElement).closest("button,input,textarea")
        )
          return;
        e.currentTarget.focus({ preventScroll: true });
        onSelect(item.id);
        gesture.begin(e, original);
      }}
      onPointerMove={gesture.move}
      onPointerUp={gesture.end}
      onPointerCancel={(e) => gesture.end(e, true)}
    >
      {editing ? (
        <InlineTextEditor
          item={item}
          event={event}
          onCancel={() => onEdit("")}
          onCommit={(change) => {
            if (change.event) onEventChange?.(change.event);
            if (change.element)
              onChange({
                ...canvas,
                elements: canvas.elements.map((el) =>
                  el.id === item.id ? { ...el, ...change.element } : el,
                ),
              });
            onEdit("");
          }}
        />
      ) : (
        <FlyerContent item={item} event={event} photoURL={photoURL} />
      )}
      {item.type === "image" && (
        <span className="canvas-photo-hint">
          <Icon name="image" /> Pulsa para cambiar foto
        </span>
      )}
      {selected && !editing && (
        <CanvasElementHandles original={original} gesture={gesture} />
      )}
    </div>
  );
}
