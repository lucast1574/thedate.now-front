import Icon from "@/components/icon";
import CelebrationAudience from "@/components/celebration-audience";
import { defaultCelebration } from "@/lib/events/celebration";
import type { useInvitationDesign } from "./use-invitation-design";
export default function ExperiencePanel({
  editor,
}: {
  editor: ReturnType<typeof useInvitationDesign>;
}) {
  const { draft, setDraft } = editor;
  const value =
    draft.celebration || defaultCelebration(draft.kind === "wedding");
  return (
    <div className="celebration-settings">
      <p className="canvas-panel-description">
        Define los detalles que quieres compartir. Nada se añade al lienzo sin
        que lo elijas.
      </p>
      <section className="celebration-settings-card">
        <h3>
          <Icon name="lucide:shirt" /> Vestimenta
        </h3>
        <label>
          Dress code
          <input
            maxLength={120}
            value={value.dressCode}
            onChange={(e) =>
              setDraft((d) => ({
                ...d,
                celebration: { ...value, dressCode: e.target.value },
              }))
            }
          />
        </label>
        <label>
          Indicaciones para tus invitados
          <textarea
            maxLength={500}
            rows={3}
            value={value.dressNote}
            onChange={(e) =>
              setDraft((d) => ({
                ...d,
                celebration: { ...value, dressNote: e.target.value },
              }))
            }
          />
        </label>
        <p>
          Añade Dress code desde Elementos. Allí puedes combinar texto, icono e
          imagen.
        </p>
      </section>
      <section className="celebration-settings-card">
        <h3>
          <Icon name="users" /> Invitados
        </h3>
        <CelebrationAudience
          value={value}
          onChange={(patch) =>
            setDraft((d) => ({ ...d, celebration: { ...value, ...patch } }))
          }
        />
      </section>
      <p className="canvas-panel-description">
        Guarda el diseño para aplicar los cambios.
      </p>
    </div>
  );
}
