import StyleFields from "@/components/style-fields";
import SectionEditor from "./section-editor";
import type { useInvitationDesign } from "./use-invitation-design";
export default function SectionWorkspace({
  editor,
}: {
  editor: ReturnType<typeof useInvitationDesign>;
}) {
  const { draft, setDraft } = editor;
  return (
    <section className="section-workspace designer-controls">
      <h2>Diseño por secciones</h2>
      <p>
        Edita el contenido y abre la vista previa para verlo como tus invitados.
      </p>
      <label>
        Título
        <input
          maxLength={160}
          value={draft.title}
          onChange={(e) =>
            setDraft((current) => ({ ...current, title: e.target.value }))
          }
        />
      </label>
      <label>
        Mensaje
        <textarea
          rows={3}
          maxLength={5000}
          value={draft.description}
          onChange={(e) =>
            setDraft((current) => ({ ...current, description: e.target.value }))
          }
        />
      </label>
      <StyleFields
        template={draft.template}
        accentColor={draft.accentColor}
        classicLabel="Clásico"
        onChange={(patch) => setDraft((current) => ({ ...current, ...patch }))}
      />
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
        className="new-event"
        disabled={editor.sections.length >= 20}
        onClick={editor.addSection}
      >
        ＋ Añadir sección
      </button>
    </section>
  );
}
