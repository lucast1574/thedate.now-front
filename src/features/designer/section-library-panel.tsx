import { useTranslator } from "@/lib/i18n/react";
import { sectionRecipes, librarySection } from "./section-library";
import Icon from "@/components/icon";
import type { useInvitationDesign } from "./use-invitation-design";
export default function SectionLibrary({
  editor,
  onSelect,
}: {
  editor: ReturnType<typeof useInvitationDesign>;
  onSelect: (id: string) => void;
}) {
  const i18n = useTranslator();

  return (
    <details className="section-library">
      <summary>
        <Icon name="plus" /> {i18n("Añadir una sección diseñada")}
      </summary>
      <p>{i18n("Con los colores y la tipografía de tu invitación.")}</p>
      <div>
        {sectionRecipes(i18n).map(([id, label, icon]) => (
          <button
            key={id}
            disabled={editor.sections.length >= 20}
            onClick={() => {
              const section = librarySection(editor.draft, id, i18n);
              editor.setDraft((current) => ({
                ...current,
                sections: [...(current.sections || []), section],
              }));
              onSelect(section.id);
            }}
          >
            <Icon name={icon} />
            {label}
            <Icon name="plus" />
          </button>
        ))}
      </div>
    </details>
  );
}
