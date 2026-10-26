import CanvasImages from "./canvas-images";
import SymbolLibrary from "./symbol-library";
import Icon from "@/components/icon";
import type { DesignEvent, Event } from "@/lib/events/types";
import type { FlyerCanvas, FlyerElement } from "@/lib/events/flyer";
import CanvasEventTools from "./canvas-event-tools";
import { element } from "./canvas-model";
export default function CanvasToolbox({
  event,
  draft,
  canvas,
  photosOnly,
  disabled,
  onAdd,
  onUpload,
  busy,
  onPhotos,
}: {
  event: Event;
  draft: DesignEvent;
  canvas: FlyerCanvas;
  photosOnly: boolean;
  disabled: boolean;
  onAdd: (item: FlyerElement) => void;
  onUpload: (file: File) => Promise<unknown>;
  busy: boolean;
  onPhotos: () => void;
}) {
  function text(value: string, size = 36) {
    onAdd(
      element("text", {
        text: value,
        x: 60,
        y: 80,
        width: canvas.width - 120,
        height: 160,
        fontSize: size,
        font: event.kind === "general" ? "sans" : "serif",
        bold: event.kind === "general" && size > 40,
        color: draft.accentColor,
      }),
    );
  }
  if (photosOnly)
    return (
      <CanvasImages
        draft={draft}
        canvas={canvas}
        disabled={disabled}
        busy={busy}
        onAdd={onAdd}
        onUpload={onUpload}
      />
    );
  return (
    <div className="canvas-toolbox">
      {!photosOnly && (
        <>
          <div className="canvas-text-presets">
            <button
              disabled={disabled}
              onClick={() =>
                text(
                  event.kind === "general"
                    ? "¡Tenemos un plan!"
                    : "Un día inolvidable",
                  56,
                )
              }
            >
              Añadir un título
            </button>
            <button
              disabled={disabled}
              onClick={() =>
                text(
                  event.kind === "general"
                    ? "Nos vemos para celebrar."
                    : "Escribe tu historia aquí",
                  28,
                )
              }
            >
              Añadir un texto
            </button>
          </div>
          <button className="canvas-photo-shortcut" onClick={onPhotos}>
            <Icon name="image" />
            <span>
              Añadir una foto
              <small>Sube una imagen o elige una de las tuyas</small>
            </span>
            <Icon name="chevron" />
          </button>
          <CanvasEventTools
            event={event}
            draft={draft}
            canvas={canvas}
            disabled={disabled}
            onAdd={onAdd}
            text={text}
          />
          <details className="canvas-symbol-disclosure">
            <summary>
              <Icon name="sparkle" />
              <span>Símbolos y adornos</span>
              <Icon name="chevron" />
            </summary>
            <SymbolLibrary
              kind={event.kind}
              disabled={disabled}
              onPick={(icon) =>
                onAdd(
                  element("icon", {
                    icon,
                    x: (canvas.width - 120) / 2,
                    y: (canvas.height - 120) / 2,
                    width: 120,
                    height: 120,
                    color: draft.accentColor,
                  }),
                )
              }
            />
          </details>
        </>
      )}
    </div>
  );
}
