import { useState } from "react";
import Icon from "@/components/icon";
import FlyerSurface from "@/components/flyer-surface";
import type { InvitationTemplate } from "@/lib/events/template-catalog";
import type { DesignEvent, DesignSection } from "@/lib/events/types";
import { applyCompleteTemplate } from "./apply-template-design";
export default function TemplateDetail({
  template,
  draft,
  onBack,
  onApply,
  onStyle,
}: {
  template: InvitationTemplate;
  draft: DesignEvent;
  section?: DesignSection;
  onBack: () => void;
  onApply: (photos: boolean) => void;
  onStyle: () => void;
  canAdd: boolean;
}) {
  const [photos, setPhotos] = useState(true);
  const pages = applyCompleteTemplate(draft, template, photos).sections || [];
  const populated = draft.sections?.some((s) => s.canvas?.elements.length);
  return (
    <section className="template-detail">
      <button type="button" className="template-back" onClick={onBack}>
        <Icon name="undo" /> Todos los diseños
      </button>
      <div className="template-detail-caption">
        <span>
          {template.category} · {pages.length} secciones editables
        </span>
        <h3>{template.name}</h3>
        <p>{template.tagline}</p>
      </div>
      <div
        className="template-photo-choices"
        aria-label="Espacios de fotografía"
      >
        <button aria-pressed={photos} onClick={() => setPhotos(true)}>
          Con fotos
        </button>
        <button aria-pressed={!photos} onClick={() => setPhotos(false)}>
          Sin espacios de foto
        </button>
      </div>
      <div className="template-detail-actions">
        <p>
          Sobre de apertura, fotos, fecha, ubicación y dress code. Pulsa las
          fotos para cambiarlas y edita cualquier texto.
        </p>
        <button className="template-apply" onClick={() => onApply(photos)}>
          <Icon name="check" /> Usar este diseño
        </button>
        <p>
          Tus textos, fotos y datos se conservan. Puedes deshacer el cambio.
        </p>
        {populated && (
          <button className="template-style-only" onClick={onStyle}>
            Solo colores y tipografía
          </button>
        )}
      </div>
      <div className="template-complete-preview">
        {pages.map((page, n) => (
          <div key={page.id}>
            <span>
              {n + 1}. {page.heading}
            </span>
            <FlyerSurface
              event={{ ...draft, accentColor: template.accent }}
              canvas={page.canvas!}
              photoURL={(key) =>
                `/api/photos/${draft.id}/${encodeURIComponent(key)}`
              }
              label={page.heading}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
