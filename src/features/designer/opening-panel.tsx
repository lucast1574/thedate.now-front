import { useState } from "react";
import Icon from "@/components/icon";
import type { Event } from "@/lib/events/types";
import type { Opening } from "@/lib/events/celebration";
import { defaultOpening } from "@/lib/events/celebration";
import { openingPresets, resolvedOpening } from "@/lib/events/opening-presets";
import OpeningArtwork from "@/features/invitations/opening-artwork";
import OpeningLivePreview from "./opening-live-preview";
import OpeningCustomization from "./opening-customization";
import OpeningBackgroundEditor from "./opening-background-editor";
import PreviewModal from "./preview-modal";
import type { useInvitationDesign } from "./use-invitation-design";
export default function OpeningPanel({
  editor,
}: {
  editor: ReturnType<typeof useInvitationDesign>;
}) {
  const { draft, setDraft } = editor;
  const original = draft.opening || {
    ...defaultOpening(draft.kind === "wedding"),
    enabled: false,
  };
  const opening = resolvedOpening(draft, original)!;
  const [preview, setPreview] = useState(false);
  const patch = (change: Partial<Opening>) =>
    setDraft((current) => ({
      ...current,
      opening: { ...(current.opening || original), ...change },
    }));
  return (
    <div className="opening-editor opening-editor-simple">
      <div className="opening-editor-state">
        <span>
          {opening.enabled ? "Apertura de tu invitación" : "Entrada directa"}
        </span>
        <button onClick={() => patch({ enabled: !opening.enabled })}>
          <Icon name={opening.enabled ? "close" : "plus"} />
          {opening.enabled ? "Quitar apertura" : "Añadir apertura"}
        </button>
      </div>
      <OpeningLivePreview key={opening.style} draft={draft} opening={opening} />
      <section className="opening-preset-picker">
        <h3>Elige cómo empieza</h3>
        <p>Seis formas de descubrir tu invitación.</p>
        <div
          className="opening-preset-grid"
          role="group"
          aria-label="Estilo de animación de apertura"
        >
          {openingPresets.map((preset) => (
            <button
              key={preset.id}
              aria-pressed={opening.enabled && opening.style === preset.id}
              onClick={() => patch({ style: preset.id, enabled: true })}
              title={preset.description}
            >
              <span
                className="opening-preset-art"
                style={
                  {
                    "--envelope-paper": opening.color,
                    "--envelope-ink": opening.ink,
                  } as React.CSSProperties
                }
              >
                <OpeningArtwork
                  opening={{ ...opening, style: preset.id, sealIcon: "" }}
                  title=""
                  wedding={draft.kind === "wedding"}
                />
              </span>
              <strong>{preset.name}</strong>
            </button>
          ))}
        </div>
      </section>
      {opening.enabled && (
        <>
          <OpeningCustomization
            opening={opening}
            kind={draft.kind}
            title={draft.title}
            patch={patch}
          />
          <OpeningBackgroundEditor editor={editor} />
          <button
            className="opening-editor-test"
            onClick={() => setPreview(true)}
          >
            <Icon name="eye" />
            Ver con mi invitación
          </button>
        </>
      )}
      <small className="editor-hint">
        Tu canvas se mantiene. Guarda el diseño para publicar la apertura.
      </small>
      {preview && (
        <PreviewModal
          draft={draft as Event}
          onClose={() => setPreview(false)}
        />
      )}
    </div>
  );
}
