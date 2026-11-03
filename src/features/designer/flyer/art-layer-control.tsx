import type { FlyerCanvas } from "@/lib/events/flyer";
import { editableOrnaments } from "../editable-ornaments";
export default function ArtLayerControl({
  canvas,
  onChange,
}: {
  canvas: FlyerCanvas;
  onChange: (canvas: FlyerCanvas) => void;
}) {
  if (!canvas.art || canvas.artEditable) return null;
  return (
    <div className="art-layer-control">
      <p>
        Este diseño conserva su decoración original. Puedes sustituirla por
        adornos editables de la misma colección.
      </p>
      <button
        type="button"
        disabled={canvas.elements.length > 57}
        onClick={() => onChange(editableOrnaments(canvas))}
      >
        Usar adornos editables
      </button>
      <small>Puedes recuperar el diseño anterior con Deshacer.</small>
    </div>
  );
}
