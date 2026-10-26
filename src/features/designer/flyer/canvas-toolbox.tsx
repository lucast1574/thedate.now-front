import Icon from "@/components/icon";
import Photo from "@/components/photo";
import type { DesignEvent, Event } from "@/lib/events/types";
import type { FlyerCanvas, FlyerElement } from "@/lib/events/flyer";
import { guestNameElement } from "@/lib/events/guest-name";
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
              onClick={() => text("Un día inolvidable", 56)}
            >
              Añadir un título
            </button>
            <button
              disabled={disabled}
              onClick={() => text("Escribe tu historia aquí", 28)}
            >
              Añadir un texto
            </button>
          </div>
          <h3>Elementos de tu invitación</h3>
          <div className="canvas-special-tools">
            <button
              disabled={disabled}
              onClick={() =>
                onAdd({
                  ...guestNameElement(draft.accentColor, crypto.randomUUID()),
                  x: 60,
                  y: 120,
                  width: canvas.width - 120,
                })
              }
            >
              <Icon name="users" />
              <span>
                Nombre del invitado
                <small>Personalizado para cada persona</small>
              </span>
              <Icon name="plus" />
            </button>
            <button
              disabled={disabled}
              onClick={() =>
                text(event.location || "Añade la ubicación de tu evento", 28)
              }
            >
              <Icon name="external" />
              <span>
                Ubicación<small>Dirección de tu evento</small>
              </span>
              <Icon name="plus" />
            </button>
            <button
              disabled={disabled}
              onClick={() =>
                text(
                  event.startAt
                    ? new Intl.DateTimeFormat("es", {
                        dateStyle: "long",
                        timeStyle: "short",
                        timeZone: event.timeZone || "America/Bogota",
                      }).format(new Date(event.startAt))
                    : "Fecha y hora",
                  30,
                )
              }
            >
              <Icon name="calendar" />
              <span>
                Fecha y hora<small>El día que van a recordar</small>
              </span>
              <Icon name="plus" />
            </button>
          </div>
          <h3>Símbolos</h3>
          <div className="canvas-symbols">
            {["heart", "flower", "star", "sparkle", "ring", "music"].map(
              (icon) => (
                <button
                  key={icon}
                  disabled={disabled}
                  aria-label={`Añadir ${icon}`}
                  onClick={() =>
                    onAdd(
                      element("icon", {
                        icon,
                        x: 60,
                        y: 80,
                        color: draft.accentColor,
                      }),
                    )
                  }
                >
                  <Icon name={icon} />
                </button>
              ),
            )}
          </div>
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
            onClick={() =>
              onAdd(
                element("image", {
                  photoKey: key,
                  x: 60,
                  y: 80,
                  width: 300,
                  height: 300,
                }),
              )
            }
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
