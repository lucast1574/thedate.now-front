import SymbolLibrary from "./symbol-library";
import { imagePlacement } from "./canvas-geometry";
import Icon from "@/components/icon";
import Photo from "@/components/photo";
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
}: {
  event: Event;
  draft: DesignEvent;
  canvas: FlyerCanvas;
  photosOnly: boolean;
  disabled: boolean;
  onAdd: (item: FlyerElement) => void;
  onUpload: (file: File) => Promise<void>;
  busy: boolean;
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
  return (
    <div className="canvas-toolbox">
      {!photosOnly && (
        <>
          <p className="canvas-panel-description">
            Elige un elemento y colócalo donde quieras.
          </p>
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
          <CanvasEventTools
            event={event}
            draft={draft}
            canvas={canvas}
            disabled={disabled}
            onAdd={onAdd}
            text={text}
          />
          <h3>Símbolos</h3>
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
        </>
      )}
      <h3>Imágenes</h3>
      <label className="canvas-upload">
        <Icon name="image" /> Subir una imagen
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          disabled={busy}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) void onUpload(file);
            e.target.value = "";
          }}
        />
      </label>
      <div className="editor-photo-grid">
        {draft.photoKeys.map((key, n) => (
          <button
            key={key}
            disabled={disabled}
            aria-label={`Añadir imagen ${n + 1}`}
            onClick={(e) => {
              const image = e.currentTarget.querySelector("img");
              onAdd(
                element("image", {
                  photoKey: key,
                  ...imagePlacement(
                    image?.naturalWidth || 300,
                    image?.naturalHeight || 300,
                    canvas,
                  ),
                }),
              );
            }}
          >
            <Photo
              src={`/api/photos/${draft.id}/${encodeURIComponent(key)}`}
              alt={`Imagen ${n + 1}`}
            />
          </button>
        ))}
      </div>
      {!draft.photoKeys.length && (
        <p className="canvas-panel-description">
          Tus fotos aparecerán aquí, listas para añadir al lienzo.
        </p>
      )}
    </div>
  );
}
