import ColorPicker from "@/components/color-picker";
import Icon from "@/components/icon";
import { defaultOpening, defaultCelebration } from "@/lib/events/celebration";
import type { useInvitationDesign } from "./use-invitation-design";
export default function ExperiencePanel({
  editor,
}: {
  editor: ReturnType<typeof useInvitationDesign>;
}) {
  const { draft, setDraft } = editor;
  const opening = draft.opening || {
    ...defaultOpening(draft.kind === "wedding"),
    enabled: false,
  };
  const celebration =
    draft.celebration || defaultCelebration(draft.kind === "wedding");
  const patchOpening = (patch: Partial<typeof opening>) =>
    setDraft((d) => ({ ...d, opening: { ...opening, ...patch } }));
  const patchCelebration = (patch: Partial<typeof celebration>) =>
    setDraft((d) => ({ ...d, celebration: { ...celebration, ...patch } }));
  return (
    <div className="experience-panel">
      <h3>El primer momento</h3>
      <p>
        Recibe a tus invitados con un sobre. También puedes entrar directamente
        al diseño.
      </p>
      <label className="experience-check">
        <input
          type="checkbox"
          checked={opening.enabled}
          onChange={(e) => patchOpening({ enabled: e.target.checked })}
        />{" "}
        Abrir con un sobre
      </label>
      {opening.enabled && (
        <>
          <div
            className="opening-styles"
            role="group"
            aria-label="Plantilla del sobre"
          >
            {(
              [
                ["classic", "Clásico", "mail"],
                ["arch", "Botánico", "leaf"],
                ["ticket", "Ticket", "ticket"],
              ] as const
            ).map(([style, label, icon]) => (
              <button
                key={style}
                aria-pressed={opening.style === style}
                onClick={() => patchOpening({ style })}
              >
                <Icon name={icon} />
                {label}
              </button>
            ))}
          </div>
          <div className="color-field">
            <span>Color del sobre</span>
            <ColorPicker
              label="Color del sobre"
              value={opening.color}
              onChange={(color) => patchOpening({ color })}
            />
          </div>
          <div className="color-field">
            <span>Tinta y sello</span>
            <ColorPicker
              label="Color de la tinta"
              value={opening.ink}
              onChange={(ink) => patchOpening({ ink })}
            />
          </div>
          <label>
            Mensaje de bienvenida
            <textarea
              maxLength={240}
              value={opening.message}
              onChange={(e) => patchOpening({ message: e.target.value })}
            />
          </label>
          <label>
            Texto para abrir
            <input
              maxLength={60}
              value={opening.buttonLabel}
              onChange={(e) => patchOpening({ buttonLabel: e.target.value })}
            />
          </label>
        </>
      )}
      <h3>Detalles de la celebración</h3>
      <label>
        Dress code
        <input
          maxLength={120}
          value={celebration.dressCode}
          onChange={(e) => patchCelebration({ dressCode: e.target.value })}
        />
      </label>
      <label>
        Indicaciones de vestimenta
        <textarea
          maxLength={500}
          value={celebration.dressNote}
          onChange={(e) => patchCelebration({ dressNote: e.target.value })}
        />
      </label>
      <p>
        Usa «Dress code» en Elementos para colocarlo donde quieras dentro del
        diseño.
      </p>
      <label className="experience-check">
        <input
          type="checkbox"
          checked={celebration.adultsOnly}
          onChange={(e) => patchCelebration({ adultsOnly: e.target.checked })}
        />{" "}
        Celebración solo para adultos
      </label>
      {celebration.adultsOnly && (
        <>
          <label>
            Cómo quieres comunicarlo
            <textarea
              maxLength={500}
              value={celebration.adultsMessage}
              onChange={(e) =>
                patchCelebration({ adultsMessage: e.target.value })
              }
            />
          </label>
          <label className="experience-check">
            <input
              type="checkbox"
              checked={celebration.whatsappNotice}
              onChange={(e) =>
                patchCelebration({ whatsappNotice: e.target.checked })
              }
            />{" "}
            Incluir este aviso en WhatsApp
          </label>
          <p>
            Se añadirá a las nuevas invitaciones enviadas después de guardar. No
            reenvía mensajes anteriores.
          </p>
        </>
      )}
      <small>
        Guarda el diseño para aplicar estos cambios. Revisa el sobre en Vista
        previa.
      </small>
    </div>
  );
}
