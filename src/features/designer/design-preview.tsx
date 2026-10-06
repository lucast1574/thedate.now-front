"use client";
import { useState } from "react";
import { createPortal } from "react-dom";
import Invitation from "@/features/invitations/invitation";
import type { Event } from "@/lib/events/types";
export default function DesignPreview({ draft }: { draft: Event }) {
  const [guestName, setGuestName] = useState("María Rojas");
  const [body, setBody] = useState<HTMLElement | null>(null);
  const [device, setDevice] = useState<"mobile" | "desktop">("mobile");
  return (
    <section
      className="editor-preview"
      aria-label="Vista previa de la invitación"
    >
      <div className="preview-toolbar">
        <strong>Así la verán tus invitados</strong>
        <div className="editor-button-row">
          <button
            type="button"
            aria-pressed={device === "mobile"}
            onClick={() => setDevice("mobile")}
          >
            Móvil
          </button>
          <button
            type="button"
            aria-pressed={device === "desktop"}
            onClick={() => setDevice("desktop")}
          >
            Escritorio
          </button>
        </div>
      </div>
      <p className="editor-hint">
        Guardar y previsualizar es gratis. El pago habilita la publicación y las
        herramientas de invitados.
      </p>
      <label className="preview-name">
        Nombre de ejemplo
        <input
          maxLength={200}
          value={guestName}
          onChange={(e) => setGuestName(e.target.value)}
        />
      </label>
      <div className="preview-device" data-device={device}>
        <iframe
          title="Vista previa real de tu invitación"
          sandbox="allow-same-origin"
          srcDoc={
            '<!doctype html><html lang="es"><head><meta name="viewport" content="width=device-width, initial-scale=1"><title>Vista previa</title></head><body></body></html>'
          }
          onLoad={(e) => {
            const doc = e.currentTarget.contentDocument;
            if (!doc) return;
            for (const node of document.querySelectorAll(
              'link[rel="stylesheet"], style',
            ))
              doc.head.appendChild(node.cloneNode(true));
            const style = doc.createElement("style");
            style.textContent = "html,body{margin:0}";
            doc.head.appendChild(style);
            setBody(doc.body);
          }}
        />
        {body &&
          createPortal(
            <div
              onClickCapture={(e) => {
                if ((e.target as HTMLElement).closest("a")) e.preventDefault();
              }}
            >
              <Invitation
                guestName={guestName}
                event={draft}
                preview={Boolean(draft.isDemo)}
                photoURL={(key) =>
                  `/api/photos/${draft.id}/${encodeURIComponent(key)}`
                }
              />
            </div>,
            body,
          )}
      </div>
    </section>
  );
}
