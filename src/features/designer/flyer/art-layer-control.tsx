import { useTranslator } from "@/lib/i18n/react";
import type { FlyerCanvas } from "@/lib/events/flyer";
import { editableOrnaments } from "../editable-ornaments";
export default function ArtLayerControl({
  canvas,
  onChange,
}: {
  canvas: FlyerCanvas;
  onChange: (canvas: FlyerCanvas) => void;
}) {
  const i18n = useTranslator();

  if (!canvas.art || canvas.artEditable) return null;
  return (
    <div className="art-layer-control">
      <p>
        {i18n(
          "Este diseño conserva su decoración original. Puedes sustituirla por adornos editables de la misma colección.",
        )}
      </p>
      <button
        type="button"
        disabled={canvas.elements.length > 57}
        onClick={() => onChange(editableOrnaments(canvas, undefined, i18n))}
      >
        {i18n("Usar adornos editables")}
      </button>
      <small>{i18n("Puedes recuperar el diseño anterior con Deshacer.")}</small>
    </div>
  );
}
