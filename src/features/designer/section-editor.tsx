import type { DesignSection } from "@/lib/events/types";
import { sectionIcons as icons } from "@/lib/events/section-icons";
type Props = {
  section: DesignSection;
  index: number;
  sectionCount: number;
  photos: string[];
  onUpdate: (patch: Partial<DesignSection>) => void;
  onMove: (direction: number) => void;
  onRemove: () => void;
};
export default function SectionEditor({
  section,
  index,
  sectionCount,
  photos,
  onUpdate,
  onMove,
  onRemove,
}: Props) {
  return (
    <div className="designer-section">
      <div className="designer-section-head">
        <strong>Sección {index + 1}</strong>
        <div>
          <button
            type="button"
            disabled={index === 0}
            onClick={() => onMove(-1)}
            aria-label="Subir sección"
          >
            ↑
          </button>
          <button
            type="button"
            disabled={index === sectionCount - 1}
            onClick={() => onMove(1)}
            aria-label="Bajar sección"
          >
            ↓
          </button>
          <button
            type="button"
            onClick={onRemove}
            aria-label="Eliminar sección"
          >
            ×
          </button>
        </div>
      </div>
      <label>
        Icono
        <select
          value={section.icon}
          onChange={(e) => onUpdate({ icon: e.target.value })}
        >
          {Object.entries(icons).map(([key, symbol]) => (
            <option key={key} value={key}>
              {symbol} {key}
            </option>
          ))}
        </select>
      </label>
      <label>
        Encabezado
        <input
          maxLength={120}
          value={section.heading}
          onChange={(e) => onUpdate({ heading: e.target.value })}
        />
      </label>
      <label>
        Texto
        <textarea
          rows={3}
          maxLength={2000}
          value={section.body}
          onChange={(e) => onUpdate({ body: e.target.value })}
        />
      </label>
      <label>
        Imagen
        <select
          value={section.photoKey || ""}
          onChange={(e) => onUpdate({ photoKey: e.target.value })}
        >
          <option value="">Sin imagen</option>
          {photos.map((key, n) => (
            <option key={key} value={key}>
              Imagen {n + 1}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}
