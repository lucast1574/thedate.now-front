import type { CSSProperties, Dispatch, SetStateAction } from "react";
import Icon from "@/components/icon";
import OpeningArtwork from "@/features/invitations/opening-artwork";
import { openingPresets } from "@/lib/events/opening-presets";
import type { Opening } from "@/lib/events/celebration";
import type { Event } from "@/lib/events/types";
export default function EventOpeningFields({
  draft,
  setDraft,
  opening,
  palette,
}: {
  draft: Event;
  setDraft: Dispatch<SetStateAction<Event>>;
  opening: Opening;
  palette: Opening;
}) {
  return (
    <details className="event-form-options" open>
      <summary>
        <Icon name="mail" />
        <span>
          La primera impresión
          <small>Apertura animada con los colores de tu plantilla.</small>
        </span>
        <Icon name="chevron" />
      </summary>
      <div>
        <div
          className="form-choice-row"
          role="group"
          aria-label="Incluir apertura"
        >
          <button
            type="button"
            aria-pressed={opening.enabled}
            onClick={() =>
              setDraft({ ...draft, opening: { ...opening, enabled: true } })
            }
          >
            Con apertura
          </button>
          <button
            type="button"
            aria-pressed={!opening.enabled}
            onClick={() =>
              setDraft({ ...draft, opening: { ...opening, enabled: false } })
            }
          >
            Entrar directamente
          </button>
        </div>
        {opening.enabled && (
          <div
            className="form-opening-grid"
            role="group"
            aria-label="Animación de apertura"
          >
            {openingPresets.map((preset) => (
              <button
                type="button"
                key={preset.id}
                aria-pressed={opening.style === preset.id}
                onClick={() =>
                  setDraft({
                    ...draft,
                    opening: {
                      ...opening,
                      style: preset.id,
                      sealIcon: undefined,
                    },
                  })
                }
              >
                <span
                  className="opening-preset-art opening-mini-loop"
                  aria-hidden="true"
                  style={
                    {
                      "--envelope-paper": palette.color,
                      "--envelope-ink": palette.ink,
                    } as CSSProperties
                  }
                >
                  <OpeningArtwork
                    opening={{
                      ...palette,
                      style: preset.id,
                      sealIcon: undefined,
                    }}
                    title=""
                    wedding={draft.kind === "wedding"}
                  />
                </span>
                <strong>{preset.name}</strong>
                <small>{preset.description}</small>
              </button>
            ))}
          </div>
        )}
        <small>
          Abre «Ver invitación» para probar la animación. En el editor puedes
          cambiar el icono y todos sus detalles.
        </small>
      </div>
    </details>
  );
}
