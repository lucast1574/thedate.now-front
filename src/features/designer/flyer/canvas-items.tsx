import { useTranslator } from "@/lib/i18n/react";
import { elementLabel } from "@/lib/events/element-label";
import { useState } from "react";
import InlineTextEditor from "./inline-text-editor";
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
  onChange,
}: {
  onChange: (canvas: FlyerCanvas) => void;
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
  const i18n = useTranslator();

  const [editing, setEditing] = useState("");
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
                fontSize: fitInvitationText(elementValue(item, event, i18n)),
              },
              canvas,
            )}
            role="button"
            tabIndex={0}
            aria-pressed={selected}
            aria-label={`${item.icon?.startsWith("art:") ? elementLabel(item, i18n) : item.binding === "map" ? i18n("Mapa") : item.binding === "couple_names" ? i18n("Nombres de los novios") : item.binding === "event_title" ? i18n("Nombre del evento") : item.binding === "event_date" ? i18n("Fecha y hora") : item.binding === "guest_name" ? i18n("Nombre del invitado") : item.binding === "location" ? i18n("Ubicación") : item.type === "text" ? item.text?.slice(0, 45) || i18n("Texto") : item.type === "image" ? i18n("Imagen") : i18n("Símbolo")}, capa ${index + 1}`}
            data-locked={item.locked || undefined}
            data-photo={item.type === "image" || undefined}
            onClick={(e) => {
              e.stopPropagation();
              const target = e.target as HTMLElement;
              if (target.closest("a")) e.preventDefault();
              if (e.shiftKey || !selected) onSelect(item.id, e.shiftKey);
              if (
                item.locked ||
                e.shiftKey ||
                selectedIds.length > 1 ||
                gesture.wasDragged() ||
                target.closest(".canvas-handle") ||
                target.closest(".canvas-photo-hint")
              )
                return;
              const hasPhoto =
                !!item.photoKey && item.photoKey !== "template-photo";
              const isPlaceholderImage = item.type === "image" && !hasPhoto;
              const isDressImage =
                item.binding === "dress_code" &&
                !!target.closest("[data-dress-image]");
              if (isPlaceholderImage || isDressImage)
                replacement.request(item.id);
            }}
            onFocus={(e) => {
              if (e.currentTarget.matches(":focus-visible")) onSelect(item.id);
            }}
            onKeyDown={(e) => {
              const hasPhoto =
                !!item.photoKey && item.photoKey !== "template-photo";
              if (
                !item.locked &&
                item.type === "image" &&
                !hasPhoto &&
                (e.key === "Enter" || e.key === " ")
              ) {
                e.preventDefault();
                replacement.request(item.id);
              } else keyboard(e, item.id);
            }}
            onDoubleClick={(e) => {
              if (item.type === "text" && !item.binding && !item.locked) {
                e.stopPropagation();
                setEditing(item.id);
              }
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
            {editing === item.id ? (
              <InlineTextEditor
                text={item.text || ""}
                onClose={() => setEditing("")}
                onCommit={(text) =>
                  onChange({
                    ...originalCanvas,
                    elements: originalCanvas.elements.map((e) =>
                      e.id === item.id ? { ...e, text } : e,
                    ),
                  })
                }
              />
            ) : (
              <FlyerContent item={item} event={event} photoURL={photoURL} />
            )}
            {item.type === "image" &&
              !item.locked &&
              item.photoKey &&
              item.photoKey !== "template-photo" && (
                <button
                  type="button"
                  className="canvas-photo-hint"
                  onPointerDown={(e) => e.stopPropagation()}
                  onClick={(e) => {
                    e.stopPropagation();
                    replacement.request(item.id);
                  }}
                >
                  <Icon name="image" /> {i18n("Pulsa para cambiar foto")}
                </button>
              )}
            {selected &&
              !item.locked &&
              selectedIds.length === 1 &&
              editing !== item.id && (
                <>
                  <button
                    type="button"
                    className="canvas-handle canvas-rotate"
                    aria-label={i18n("Rotar elemento")}
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
                      aria-label={i18n("Cambiar tamaño del elemento")}
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
