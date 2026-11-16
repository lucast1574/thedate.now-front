import { useTranslator } from "@/lib/i18n/react";
import Photo from "@/components/photo";
import type { DesignEvent } from "@/lib/events/types";
import type { FlyerCanvas, FlyerElement } from "@/lib/events/flyer";
export default function FlyerPhotoGrid({
  draft,
  canvas,
  photoURL,
  add,
}: {
  draft: DesignEvent;
  canvas: FlyerCanvas;
  photoURL: (key: string) => string;
  add: (type: FlyerElement["type"], photoKey?: string) => void;
}) {
  const i18n = useTranslator();
  if (!draft.photoKeys.length)
    return (
      <>
        <div className="editor-photo-grid" />
        <p className="editor-hint">
          {i18n("Sube una imagen con el botón de la barra superior.")}
        </p>
      </>
    );
  return (
    <div className="editor-photo-grid">
      {draft.photoKeys.map((key, n) => (
        <button
          type="button"
          key={key}
          disabled={canvas.elements.length >= 60}
          aria-label={i18n("Añadir imagen {v0} al lienzo", { v0: n + 1 })}
          onClick={() => add("image", key)}
        >
          <Photo src={photoURL(key)} alt={i18n("Imagen {v0}", { v0: n + 1 })} />
        </button>
      ))}
    </div>
  );
}
