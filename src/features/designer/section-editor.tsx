import { useTranslator } from "@/lib/i18n/react";
import Listbox from "@/components/listbox";
import GuestTextEditor from "./guest-text-editor";
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
  const i18n = useTranslator();

  return (
    <div className="designer-section">
      <div className="designer-section-head">
        <strong>
          {i18n("Sección")} {index + 1}
        </strong>
        <div>
          <button
            type="button"
            disabled={index === 0}
            onClick={() => onMove(-1)}
            aria-label={i18n("Subir sección")}
          >
            ↑
          </button>
          <button
            type="button"
            disabled={index === sectionCount - 1}
            onClick={() => onMove(1)}
            aria-label={i18n("Bajar sección")}
          >
            ↓
          </button>
          <button
            type="button"
            onClick={onRemove}
            aria-label={i18n("Eliminar sección")}
          >
            ×
          </button>
        </div>
      </div>
      <label>
        {i18n("Icono")}{" "}
        <Listbox
          value={section.icon}
          onValueChange={(value) => onUpdate({ icon: value })}
        >
          {Object.entries(icons).map(([key, symbol]) => (
            <option key={key} value={key}>
              {i18n(symbol)}
            </option>
          ))}
        </Listbox>
      </label>
      <label>
        {i18n("Encabezado")}{" "}
        <input
          maxLength={120}
          value={section.heading}
          onChange={(e) => onUpdate({ heading: e.target.value })}
        />
      </label>
      <label>
        {i18n("Texto")}{" "}
        <textarea
          rows={3}
          maxLength={2000}
          value={section.body}
          onChange={(e) => onUpdate({ body: e.target.value })}
        />
      </label>
      {section.guestText && (
        <GuestTextEditor
          item={section.guestText}
          onChange={(patch) =>
            onUpdate({ guestText: { ...section.guestText!, ...patch } })
          }
          onRemove={() => onUpdate({ guestText: undefined })}
        />
      )}
      <label>
        {i18n("Imagen")}{" "}
        <Listbox
          value={section.photoKey || ""}
          onValueChange={(value) => onUpdate({ photoKey: value })}
        >
          <option value="">{i18n("Sin imagen")}</option>
          {photos.map((key, n) => (
            <option key={key} value={key}>
              {i18n("Imagen")} {n + 1}
            </option>
          ))}
        </Listbox>
      </label>
    </div>
  );
}
