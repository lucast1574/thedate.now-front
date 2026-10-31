import { flyerElementStyle } from "@/lib/events/flyer-element-style";
import Icon from "@/components/icon";
import { FlyerContent } from "@/components/flyer-surface";
import { fitInvitationText } from "@/lib/events/fit-invitation-text";
import { elementValue } from "@/lib/events/element-values";
import type { FlyerCanvas } from "@/lib/events/flyer";
import type { PublicEvent } from "@/lib/events/types";
import type { KeyboardEvent } from "react";
import type { useCanvasGesture } from "./use-canvas-gesture";
import type { useImageReplacement } from "./use-image-replacement";
import type { useCanvasMenu } from "./use-canvas-menu";
export default function CanvasItems({
  canvas,
  originalCanvas,
  selectedIds,
  onSelect,
  gesture,
  replacement,
  context,
  keyboard,
  event,
  photoURL,
}: {
  canvas: FlyerCanvas;
  originalCanvas: FlyerCanvas;
  selectedIds: string[];
  onSelect: (id: string, multiple?: boolean) => void;
  gesture: ReturnType<typeof useCanvasGesture>;
  replacement: ReturnType<typeof useImageReplacement>;
  context: ReturnType<typeof useCanvasMenu>;
  keyboard: (e: KeyboardEvent, id: string) => void;
  event?: Partial<PublicEvent>;
  photoURL: (key: string) => string;
}) {
  return (
    <>
      {canvas.elements.map((item, index) => {
        const original = originalCanvas.elements.find((e) => e.id === item.id)!;
        const selected = selectedIds.includes(item.id);
        return (
          <div
            key={item.id}
            className={`flyer-element canvas-item ${selected ? "is-selected" : ""}`}
            style={flyerElementStyle(
              {
                ...item,
                fontSize: fitInvitationText(elementValue(item, event)),
              },
              canvas,
            )}
            role="button"
            tabIndex={0}
            aria-pressed={selected}
            aria-label={`${item.binding === "map" ? "Mapa" : item.binding === "couple_names" ? "Nombres de los novios" : item.binding === "event_title" ? "Nombre del evento" : item.binding === "event_date" ? "Fecha y hora" : item.binding === "guest_name" ? "Nombre del invitado" : item.binding === "location" ? "Ubicación" : item.type === "text" ? item.text?.slice(0, 45) || "Texto" : item.type === "image" ? "Imagen" : "Símbolo"}, capa ${index + 1}`}
            data-locked={item.locked || undefined}
            data-photo={item.type === "image" || undefined}
            onClick={(e) => {
              e.stopPropagation();
              if ((e.target as HTMLElement).closest("a")) e.preventDefault();
              if (e.shiftKey || !selected) onSelect(item.id, e.shiftKey);
              const imageTarget =
                item.type === "image" ||
                (item.binding === "dress_code" &&
                  (e.target as HTMLElement).closest("[data-dress-image]"));
              if (
                imageTarget &&
                !item.locked &&
                !e.shiftKey &&
                selectedIds.length <= 1 &&
                !gesture.wasDragged() &&
                !(e.target as HTMLElement).closest(".canvas-handle")
              )
                replacement.request(item.id);
            }}
            onFocus={(e) => {
              if (e.currentTarget.matches(":focus-visible")) onSelect(item.id);
            }}
            onKeyDown={(e) => {
              if (
                !item.locked &&
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
              if (e.shiftKey) return;
              if (!selected) onSelect(item.id);
              gesture.begin(e, original);
            }}
            onPointerMove={gesture.move}
            onPointerUp={gesture.end}
            onPointerCancel={(e) => gesture.end(e, true)}
          >
            <FlyerContent item={item} event={event} photoURL={photoURL} />
            {item.type === "image" && !item.locked && (
              <span className="canvas-photo-hint">
                <Icon name="image" /> Pulsa para cambiar foto
              </span>
            )}
            {selected && !item.locked && selectedIds.length === 1 && (
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
    </>
  );
}
