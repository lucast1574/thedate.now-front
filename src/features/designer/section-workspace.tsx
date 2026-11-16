import { useTranslator } from "@/lib/i18n/react";
import {
  invitationTemplates,
  resolveTemplateId,
} from "@/lib/events/template-catalog";
import StyleFields from "@/components/style-fields";
import SectionEditor from "./section-editor";
import type { useInvitationDesign } from "./use-invitation-design";
export default function SectionWorkspace({
  editor,
}: {
  editor: ReturnType<typeof useInvitationDesign>;
}) {
  const i18n = useTranslator();

  const { draft, setDraft } = editor;
  const template = invitationTemplates(i18n).find(
    (item) =>
      item.id === draft.templateId &&
      item.kind === draft.kind &&
      item.mode === "sections",
  );
  return (
    <section className="section-workspace designer-controls">
      <h2>{i18n("Diseño por secciones")}</h2>
      <p>
        {i18n(
          "Edita el contenido y abre la vista previa para verlo como tus invitados.",
        )}
      </p>
      <label>
        {i18n("Título")}{" "}
        <input
          maxLength={160}
          value={draft.title}
          onChange={(e) =>
            setDraft((current) => ({ ...current, title: e.target.value }))
          }
        />
      </label>
      <label>
        {i18n("Mensaje")}{" "}
        <textarea
          rows={3}
          maxLength={5000}
          value={draft.description}
          onChange={(e) =>
            setDraft((current) => ({ ...current, description: e.target.value }))
          }
        />
      </label>
      {template && (
        <details className="template-customization">
          <summary>
            {i18n("Personalizar plantilla ·")} {template.name}
          </summary>
          <StyleFields
            template={draft.template}
            accentColor={draft.accentColor}
            classicLabel="Clásico"
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
                        undefined,
                        i18n,
                      ),
                    }
                  : {}),
              }))
            }
          />
        </details>
      )}
      <div className="designer-sections">
        {editor.sections.map((section, index) => (
          <SectionEditor
            key={section.id}
            section={section}
            index={index}
            sectionCount={editor.sections.length}
            photos={draft.photoKeys}
            onUpdate={(patch) => editor.updateSection(index, patch)}
            onMove={(direction) => editor.moveSection(index, direction)}
            onRemove={() => editor.removeSection(section.id)}
          />
        ))}
      </div>
      <button
        type="button"
        disabled={editor.sections.length >= 20}
        onClick={editor.addGuestSection}
      >
        {i18n("＋ Nombre del invitado")}
      </button>
      <button
        type="button"
        className="new-event"
        disabled={editor.sections.length >= 20}
        onClick={editor.addSection}
      >
        {i18n("＋ Añadir sección")}
      </button>
    </section>
  );
}
