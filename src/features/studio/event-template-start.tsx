import { useMemo, useState, type Dispatch, type SetStateAction } from "react";
import Icon from "@/components/icon";
import FlyerSurface from "@/components/flyer-surface";
import PreviewModal from "@/features/designer/preview-modal";
import { applyCompleteTemplate } from "@/features/designer/template-sequence";
import { templateCanvas } from "@/features/designer/template-canvas";
import { invitationTemplates } from "@/lib/events/template-catalog";
import type { Event } from "@/lib/events/types";
import EventDesignDetails from "./event-design-details";

export default function EventTemplateStart({
  draft,
  setDraft,
}: {
  draft: Event;
  setDraft: Dispatch<SetStateAction<Event>>;
}) {
  const [preview, setPreview] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const templates = invitationTemplates.filter(
    (t) => t.kind === draft.kind && t.mode === "flyer",
  );
  const template = templates.find((t) => t.id === draft.templateId);
  const featured =
    template && !templates.slice(0, 4).includes(template)
      ? [...templates.slice(0, 3), template]
      : templates.slice(0, 4);
  const designed = useMemo(() => {
    const selected = invitationTemplates.find(
      (item) =>
        item.id === draft.templateId &&
        item.kind === draft.kind &&
        item.mode === "flyer",
    );
    return selected
      ? { ...draft, ...applyCompleteTemplate(draft, selected) }
      : draft;
  }, [draft]);
  return (
    <section
      className="event-template-picker"
      aria-labelledby="initial-style-title"
    >
      <header className="event-template-heading">
        <div>
          <span className="form-eyebrow">03 / TU INVITACIÓN</span>
          <h2 id="initial-style-title">Un estilo que se sienta tuyo</h2>
          <p>
            Plantillas completas, apertura animada y detalles editables en el
            lienzo.
          </p>
        </div>
        <button
          type="button"
          className="form-preview-button"
          onClick={() => setPreview(true)}
        >
          <Icon name="eye" /> Ver invitación
        </button>
      </header>
      <div
        className="event-template-grid"
        role="group"
        aria-label="Plantilla inicial"
      >
        {(showAll ? templates : featured).map((item) => (
          <button
            type="button"
            key={item.id}
            aria-pressed={template?.id === item.id}
            onClick={() =>
              setDraft((current) => ({
                ...current,
                templateId: item.id,
                template: item.style,
                designMode: "flyer",
                accentColor: item.accent,
              }))
            }
          >
            <span className="event-template-art" aria-hidden="true" inert>
              <FlyerSurface
                canvas={templateCanvas(item, {
                  title: draft.title,
                  body: draft.description,
                })}
                photoURL={() => ""}
                label={item.name}
              />
            </span>
            <span className="event-template-caption">
              <strong>{item.name}</strong>
              <small>{item.category}</small>
              {template?.id === item.id && <Icon name="check" />}
            </span>
          </button>
        ))}
      </div>
      <button
        type="button"
        className="form-template-more"
        onClick={() => setShowAll(!showAll)}
      >
        {showAll ? "Mostrar menos" : `Explorar los ${templates.length} estilos`}{" "}
        <Icon name="chevron" />
      </button>
      {template && (
        <>
          <p className="event-template-selected">
            <Icon name="check" /> {template.name} · {designed.sections?.length}{" "}
            secciones listas para personalizar
          </p>
          <EventDesignDetails
            draft={draft}
            setDraft={setDraft}
            template={template}
          />
        </>
      )}
      <p className="event-template-footnote">
        Después podrás cambiar fotos, iconos, colores, música y cada elemento
        del lienzo. La lista de regalos se configura desde el organizador.
      </p>
      {preview && (
        <PreviewModal draft={designed} onClose={() => setPreview(false)} />
      )}
    </section>
  );
}
