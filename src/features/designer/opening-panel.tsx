import { useTranslator } from "@/lib/i18n/react";
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
  const i18n = useTranslator();

  const { draft, setDraft } = editor;
  const original = draft.opening || {
    ...defaultOpening(draft.kind === "wedding", undefined, undefined, i18n),
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
          {opening.enabled
            ? i18n("Apertura de tu invitación")
            : i18n("Entrada directa")}
        </span>
        <button onClick={() => patch({ enabled: !opening.enabled })}>
          <Icon name={opening.enabled ? "close" : "plus"} />
          {opening.enabled ? i18n("Quitar apertura") : i18n("Añadir apertura")}
        </button>
      </div>
      <OpeningLivePreview key={opening.style} draft={draft} opening={opening} />
      <section className="opening-preset-picker">
        <h3>{i18n("Elige cómo empieza")}</h3>
        <p>{i18n("Seis formas de descubrir tu invitación.")}</p>
        <div
          className="opening-preset-grid"
          role="group"
          aria-label={i18n("Estilo de animación de apertura")}
        >
          {openingPresets(i18n).map((preset) => (
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
            {i18n("Ver con mi invitación")}
          </button>
        </>
      )}
      <small className="editor-hint">
        {i18n(
          "Tu canvas se mantiene. Guarda el diseño para publicar la apertura.",
        )}
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
