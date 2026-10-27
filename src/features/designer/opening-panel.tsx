import FlyerBackground from "@/components/flyer-background";
import OpeningBackgroundEditor from "./opening-background-editor";
import { useState } from "react";
import Icon from "@/components/icon";
import ColorPicker from "@/components/color-picker";
import Listbox from "@/components/listbox";
import OpeningArtwork from "@/features/invitations/opening-artwork";
import { defaultOpening } from "@/lib/events/celebration";
import { flyerFonts } from "@/lib/events/flyer";
import type { Event } from "@/lib/events/types";
import PreviewModal from "./preview-modal";
import SymbolLibrary from "./flyer/symbol-library";
import type { useInvitationDesign } from "./use-invitation-design";
export default function OpeningPanel({
  editor,
}: {
  editor: ReturnType<typeof useInvitationDesign>;
}) {
  const { draft, setDraft } = editor;
  const wedding = draft.kind === "wedding";
  const opening = draft.opening || {
    ...defaultOpening(wedding),
    enabled: false,
  };
  const [preview, setPreview] = useState(false);
  const patch = (change: Partial<typeof opening>) =>
    setDraft((d) => ({ ...d, opening: { ...opening, ...change } }));
  return (
    <div className="opening-editor">
      <p className="canvas-panel-description">
        Una entrada especial antes de tu invitación. Elígela, personalízala o
        deja que tus invitados entren directamente.
      </p>
      <div
        className="opening-editor-preview"
        data-style={opening.style}
        style={
          {
            "--envelope-paper": opening.color,
            "--envelope-ink": opening.ink,
          } as React.CSSProperties
        }
      >
        {opening.backgroundImage && (
          <FlyerBackground
            slice={{
              image: opening.backgroundImage,
              offset: 0,
              total: 1,
              height: 1,
            }}
            photoURL={(key) =>
              `/api/photos/${draft.id}/${encodeURIComponent(key)}`
            }
          />
        )}
        <h3
          style={
            opening.font ? { fontFamily: flyerFonts[opening.font] } : undefined
          }
        >
          {opening.title || draft.title || "Tu invitación"}
        </h3>
        <div className="opening-envelope" aria-hidden="true">
          <OpeningArtwork
            opening={opening}
            title={draft.title}
            wedding={wedding}
          />
        </div>
        <p>{opening.message}</p>
        <small>{opening.buttonLabel}</small>
      </div>
      <div className="opening-editor-state">
        <span>{opening.enabled ? "Apertura añadida" : "Entrada directa"}</span>
        <button onClick={() => patch({ enabled: !opening.enabled })}>
          <Icon name={opening.enabled ? "close" : "plus"} />
          {opening.enabled ? "Quitar apertura" : "Añadir apertura"}
        </button>
      </div>
      <h3>Elige una forma de abrir</h3>
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
            aria-pressed={opening.enabled && opening.style === style}
            onClick={() => patch({ style, enabled: true })}
          >
            <Icon name={icon} />
            {label}
          </button>
        ))}
      </div>
      {opening.enabled && (
        <>
          <section className="opening-editor-fields">
            <h3>Lo que van a leer</h3>
            <label>
              Título de la apertura
              <input
                maxLength={160}
                placeholder={draft.title}
                value={opening.title || ""}
                onChange={(e) => patch({ title: e.target.value })}
              />
            </label>
            <label>
              Mensaje de bienvenida
              <textarea
                maxLength={240}
                rows={3}
                value={opening.message}
                onChange={(e) => patch({ message: e.target.value })}
              />
            </label>
            <label>
              Texto del botón
              <input
                maxLength={60}
                value={opening.buttonLabel}
                onChange={(e) => patch({ buttonLabel: e.target.value })}
              />
            </label>
            <label>
              Letra del título
              <Listbox
                aria-label="Letra del título de apertura"
                value={opening.font || ""}
                onValueChange={(font) =>
                  patch({ font: font as typeof opening.font })
                }
              >
                <option value="">Del diseño</option>
                <option value="serif">Serif</option>
                <option value="sans">Sans</option>
                <option value="script">Manuscrita</option>
              </Listbox>
            </label>
          </section>
          <section className="opening-editor-fields">
            <h3>Colores</h3>
            <div className="color-field">
              <span>Sobre y fondo</span>
              <ColorPicker
                label="Color del sobre"
                value={opening.color}
                onChange={(color) => patch({ color })}
              />
            </div>
            <div className="color-field">
              <span>Texto y sello</span>
              <ColorPicker
                label="Color de la tinta"
                value={opening.ink}
                onChange={(ink) => patch({ ink })}
              />
            </div>
          </section>
          <OpeningBackgroundEditor editor={editor} />
          <details className="symbol-replace">
            <summary>Personalizar el sello</summary>
            <button onClick={() => patch({ sealIcon: "none" })}>
              Sin sello
            </button>
            <SymbolLibrary
              kind={draft.kind}
              onPick={(sealIcon) => patch({ sealIcon })}
            />
          </details>
          <button
            className="opening-editor-test"
            onClick={() => setPreview(true)}
          >
            <Icon name="eye" /> Probar apertura
          </button>
        </>
      )}
      <small className="editor-hint">
        Guarda el diseño para publicar tus cambios. La apertura no ocupa una
        sección del lienzo.
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
