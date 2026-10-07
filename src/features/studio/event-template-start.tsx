import { useState, type Dispatch, type SetStateAction } from "react";
import StyleFields from "@/components/style-fields";
import PreviewModal from "@/features/designer/preview-modal";
import { resolveTemplateId } from "@/lib/events/template-catalog";
import { blankEvent } from "@/lib/events/draft";
import type { Event } from "@/lib/events/types";
export default function EventTemplateStart({
  draft,
  setDraft,
}: {
  draft: Event;
  setDraft: Dispatch<SetStateAction<Event>>;
}) {
  const [enabled, setEnabled] = useState(false);
  const [preview, setPreview] = useState(false);
  const ready = Boolean(
    draft.title.trim() &&
    draft.startAt &&
    !Number.isNaN(new Date(draft.startAt).getTime()),
  );
  return (
    <div className="template-start">
      <label className="template-start-choice">
        <input
          type="checkbox"
          checked={enabled}
          onChange={(e) => {
            setEnabled(e.target.checked);
            if (!e.target.checked) {
              const defaults = blankEvent(draft.kind);
              setDraft((current) => ({
                ...current,
                template: defaults.template,
                templateId: defaults.templateId,
                accentColor: defaults.accentColor,
              }));
            }
          }}
        />
        <span>
          Empezar con una plantilla
          <small>
            Elige un estilo inicial. Después puedes cambiarlo en el editor.
          </small>
        </span>
      </label>
      {enabled && (
        <>
          <StyleFields
            template={draft.template}
            accentColor={draft.accentColor}
            classicLabel={
              draft.kind === "wedding" ? "Clásico editorial" : "Clásico"
            }
            colorLabel="Color de acento"
            onChange={(patch) =>
              setDraft((current) => ({
                ...current,
                ...patch,
                ...(patch.template
                  ? {
                      templateId: resolveTemplateId(
                        current.kind,
                        patch.template,
                        "sections",
                      ),
                    }
                  : {}),
              }))
            }
          />
          <button
            type="button"
            className="template-start-preview"
            disabled={!ready}
            onClick={() => setPreview(true)}
          >
            Ver cómo quedará
          </button>
          <small>
            {ready
              ? "Vista previa gratis. Se aplicará al crear tu invitación; luego puedes seguir editando."
              : "Completa el nombre y la fecha para ver tu invitación con este estilo."}
          </small>
        </>
      )}
      {preview && (
        <PreviewModal draft={draft} onClose={() => setPreview(false)} />
      )}
    </div>
  );
}
