import { useTranslator } from "@/lib/i18n/react";
import { openingPreset } from "@/lib/events/opening-presets";
import { templateOpening } from "./template-opening";
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
  const i18n = useTranslator();

  const [photos, setPhotos] = useState(true);
  const pages =
    applyCompleteTemplate(draft, template, photos, i18n).sections || [];
  const populated = draft.sections?.some((s) => s.canvas?.elements.length);
  return (
    <section className="template-detail">
      <button type="button" className="template-back" onClick={onBack}>
        <Icon name="undo" /> {i18n("Todos los diseños")}
      </button>
      <div className="template-detail-caption">
        <span>
          {i18n(template.category || "Otros")} · {pages.length}{" "}
          {i18n("secciones editables")}
        </span>
        <h3>{template.name}</h3>
        <p>{template.tagline}</p>
      </div>
      <div
        className="template-photo-choices"
        aria-label={i18n("Espacios de fotografía")}
      >
        <button aria-pressed={photos} onClick={() => setPhotos(true)}>
          {i18n("Con fotos")}
        </button>
        <button aria-pressed={!photos} onClick={() => setPhotos(false)}>
          {i18n("Sin espacios de foto")}
        </button>
      </div>
      <div className="template-detail-actions">
        <p>
          {i18n("Apertura")}{" "}
          {openingPreset(
            templateOpening(template, i18n).style,
            i18n,
          ).name.toLowerCase()}
          {i18n(
            ", fotos, fecha, ubicación y vestimenta. Pulsa las fotos para cambiarlas y edita cualquier texto.",
          )}
        </p>
        <button className="template-apply" onClick={() => onApply(photos)}>
          <Icon name="check" /> {i18n("Usar este diseño")}
        </button>
        <p>
          {i18n(
            "La plantilla reemplaza todos los bloques. Los textos y fotos con un lugar equivalente se conservan. Puedes deshacer el cambio.",
          )}
        </p>
        {populated && (
          <button className="template-style-only" onClick={onStyle}>
            {i18n("Solo colores y tipografía")}
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
