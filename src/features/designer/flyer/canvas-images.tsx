import Icon from "@/components/icon";
import Photo from "@/components/photo";
import { imagePlacement } from "./canvas-geometry";
import { element } from "./canvas-model";
import type { DesignEvent } from "@/lib/events/types";
import type { FlyerCanvas, FlyerElement } from "@/lib/events/flyer";
export default function CanvasImages({
  draft,
  canvas,
  disabled,
  busy,
  onAdd,
  onUpload,
}: {
  draft: DesignEvent;
  canvas: FlyerCanvas;
  disabled: boolean;
  busy: boolean;
  onAdd: (item: FlyerElement) => void;
  onUpload: (file: File) => Promise<unknown>;
}) {
  return (
    <div className="canvas-images">
      <p className="canvas-panel-description">
        Sube tus fotos y pulsa una para añadirla a la sección activa.
      </p>
      <label className="canvas-upload">
        <Icon name="image" /> {busy ? "Subiendo imagen…" : "Subir una imagen"}
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
          Tus fotos aparecerán aquí. Las de una plantilla también se cambian
          pulsándolas en el lienzo.
        </p>
      )}
    </div>
  );
}
