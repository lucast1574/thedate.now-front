import Icon from "@/components/icon";
import FlyerSurface from "@/components/flyer-surface";
import type { InvitationTemplate } from "@/lib/events/template-catalog";
import type { DesignEvent, DesignSection } from "@/lib/events/types";
import { templateCanvas } from "./template-canvas";
export default function TemplateDetail({
  template,
  draft,
  section,
  onBack,
  onApply,
  onStyle,
  canAdd,
}: {
  template: InvitationTemplate;
  draft: DesignEvent;
  section?: DesignSection;
  onBack: () => void;
  onApply: () => void;
  onStyle: () => void;
  canAdd: boolean;
}) {
  const populated = Boolean(section?.canvas?.elements.length);
  const canvas = templateCanvas(template, {
    title: draft.title,
    body: draft.description,
    photoKey: draft.photoKeys[0],
  });
  return (
    <section className="template-detail">
      <button type="button" className="template-back" onClick={onBack}>
        <Icon name="undo" /> Todos los diseños
      </button>
      <div className="template-detail-caption">
        <span>{template.category || "Diseño"}</span>
        <h3>{template.name}</h3>
        <p>{template.tagline}</p>
      </div>
      <div className="template-detail-art">
        <FlyerSurface
          canvas={canvas}
          photoURL={(key) =>
            `/api/photos/${draft.id}/${encodeURIComponent(key)}`
          }
          label={`Vista del diseño ${template.name}`}
        />
      </div>
      <div className="template-detail-actions">
        <p>
          {populated
            ? "Tu sección ya tiene contenido. Añadiremos el diseño debajo, conservando lo que has creado."
            : `Se aplicará a «${section?.heading || "tu sección"}». Todos sus elementos se pueden editar.`}
        </p>
        <button
          type="button"
          className="template-apply"
          disabled={populated && !canAdd}
          onClick={onApply}
        >
          <Icon name="plus" />
          {populated ? "Añadir como nueva sección" : "Usar en esta sección"}
        </button>
        {populated && (
          <button
            type="button"
            className="template-style-only"
            onClick={onStyle}
          >
            Solo aplicar colores y tipografía
          </button>
        )}
        {!canAdd && populated && (
          <small>Has llegado al límite de 20 secciones.</small>
        )}
      </div>
    </section>
  );
}
