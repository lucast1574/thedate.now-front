import { useState } from "react";
import Icon from "@/components/icon";
import FlyerSurface from "@/components/flyer-surface";
import type { InvitationTemplate } from "@/lib/events/template-catalog";
import type { DesignEvent, DesignSection } from "@/lib/events/types";
import { templateSequence } from "./template-sequence";
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
  onApply: () => void;
  onStyle: () => void;
  canAdd: boolean;
}) {
  const [confirm, setConfirm] = useState(false);
  const pages = templateSequence(template, draft);
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
      <div className="template-detail-actions">
        <p>
          Sobre de apertura, fotos, fecha, ubicación y dress code. Pulsa las
          fotos para cambiarlas y edita cualquier texto.
        </p>
        {confirm ? (
          <div className="template-replace-confirm" role="alert">
            <p>
              Esto reemplazará tus {draft.sections?.length} secciones por la
              invitación completa. Tus archivos siguen en la biblioteca; las
              fotos de la plantilla quedan vacías. Puedes deshacer.
            </p>
            <button className="template-apply" onClick={onApply}>
              Reemplazar mis secciones
            </button>
            <button onClick={() => setConfirm(false)}>Volver</button>
          </div>
        ) : (
          <button
            className="template-apply"
            onClick={() => (populated ? setConfirm(true) : onApply())}
          >
            <Icon name="check" /> Usar invitación completa
          </button>
        )}
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
