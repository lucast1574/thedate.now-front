import { useTranslator } from "@/lib/i18n/react";
import { useMemo, useState, type Dispatch, type SetStateAction } from "react";
import Icon from "@/components/icon";
import FlyerSurface from "@/components/flyer-surface";
import PreviewModal from "@/features/designer/preview-modal";
import { applyCompleteTemplate } from "@/features/designer/apply-template-design";
import { templateCanvas } from "@/features/designer/template-canvas";
import { invitationTemplates } from "@/lib/events/template-catalog";
import type { Event } from "@/lib/events/types";
import EventOpeningFields from "./event-opening-fields";
import { templateOpening } from "@/features/designer/template-opening";
import { blankInvitation, isBlankInvitation } from "./blank-invitation";
import InvitationStartChoice from "./invitation-start-choice";

export default function EventTemplateStart({
  draft,
  setDraft,
}: {
  draft: Event;
  setDraft: Dispatch<SetStateAction<Event>>;
}) {
  const i18n = useTranslator();

  const [preview, setPreview] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [previousTemplateId, setPreviousTemplateId] = useState(
    draft.templateId,
  );
  const blank = isBlankInvitation(draft);
  const templates = invitationTemplates(i18n).filter(
    (t) => t.kind === draft.kind && t.mode === "flyer",
  );
  const template = templates.find((t) => t.id === draft.templateId);
  const opening =
    draft.opening || (template ? templateOpening(template, i18n) : undefined);
  const featured =
    template && !templates.slice(0, 4).includes(template)
      ? [...templates.slice(0, 3), template]
      : templates.slice(0, 4);
  const designed = useMemo(() => {
    if (isBlankInvitation(draft)) return blankInvitation(draft, i18n);
    const selected = invitationTemplates(i18n).find(
      (item) =>
        item.id === draft.templateId &&
        item.kind === draft.kind &&
        item.mode === "flyer",
    );
    return selected
      ? { ...draft, ...applyCompleteTemplate(draft, selected, undefined, i18n) }
      : draft;
  }, [draft, i18n]);
  function chooseStart(nextBlank: boolean) {
    if (nextBlank === blank) return;
    if (nextBlank) setPreviousTemplateId(draft.templateId);
    const previous =
      templates.find((item) => item.id === previousTemplateId) || templates[0];
    setDraft((current) =>
      nextBlank
        ? blankInvitation(current, i18n)
        : {
            ...current,
            templateId: previous.id,
            template: previous.style,
            accentColor: previous.accent,
            opening: null,
          },
    );
  }
  return (
    <section
      className="event-template-picker"
      aria-labelledby="initial-style-title"
    >
      <header className="event-template-heading">
        <div>
          <span className="form-eyebrow">{i18n("03 / TU INVITACIÓN")}</span>
          <h2 id="initial-style-title">
            {i18n("Un estilo que se sienta tuyo")}
          </h2>
          <p>{i18n("Elige un diseño o empieza con un lienzo en blanco.")}</p>
        </div>
        <button
          type="button"
          className="form-preview-button"
          onClick={() => setPreview(true)}
        >
          <Icon name="eye" /> {i18n("Ver invitación")}
        </button>
      </header>
      <InvitationStartChoice blank={blank} onChange={chooseStart} />
      {blank ? (
        <div className="invitation-blank-summary">
          <span className="invitation-blank-paper" aria-hidden="true">
            <Icon name="plus" />
          </span>
          <div>
            <h3>{i18n("Tu invitación empieza contigo.")}</h3>
            <p>
              {i18n(
                "Añade textos, fotos y detalles a tu ritmo en el editor. También podrás elegir una plantilla más adelante.",
              )}
            </p>
          </div>
        </div>
      ) : (
        <>
          <div
            className="event-template-grid"
            role="group"
            aria-label={i18n("Plantilla inicial")}
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
                    canvas={templateCanvas(
                      item,
                      {
                        title: draft.title,
                        body: draft.description,
                      },
                      i18n,
                    )}
                    photoURL={() => ""}
                    label={item.name}
                  />
                </span>
                <span className="event-template-caption">
                  <strong>{item.name}</strong>
                  <small>{i18n(item.category || "Otros")}</small>
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
            {showAll
              ? i18n("Mostrar menos")
              : i18n("Explorar los {v0} estilos", {
                  v0: templates.length,
                })}{" "}
            <Icon name="chevron" />
          </button>
          {template && (
            <>
              <p className="event-template-selected">
                <Icon name="check" /> {template.name} ·{" "}
                {designed.sections?.length}{" "}
                {i18n("secciones listas para personalizar")}
              </p>
              <EventOpeningFields
                draft={draft}
                setDraft={setDraft}
                opening={opening!}
                palette={
                  opening?.paletteMode === "design"
                    ? templateOpening(template, i18n)
                    : opening!
                }
              />
            </>
          )}
        </>
      )}
      <p className="event-template-footnote">
        {i18n(
          "Después podrás cambiar fotos, iconos, colores, música y cada elemento del lienzo. La lista de regalos se configura desde el organizador.",
        )}
      </p>
      {preview && (
        <PreviewModal draft={designed} onClose={() => setPreview(false)} />
      )}
    </section>
  );
}
