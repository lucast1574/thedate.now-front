import { useRef, useEffect, useState } from "react";
import type { DesignEvent } from "@/lib/events/types";
import { api } from "@/lib/api/client";
import FlyerSurface from "@/components/flyer-surface";
import {
  invitationTemplates,
  type InvitationTemplate,
} from "@/lib/events/template-catalog";
import { templateThumbnail } from "./template-thumbnail";
export default function TemplateGallery({
  draft,
  onApply,
  onClose,
}: {
  draft: DesignEvent;
  onApply: (template: InvitationTemplate) => void;
  onClose: () => void;
}) {
  const [catalog, setCatalog] = useState(invitationTemplates);
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    dialog.current?.showModal();
    let active = true;
    api<InvitationTemplate[]>("/api/backend/templates")
      .then((list) => {
        if (active) setCatalog(list);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);
  return (
    <dialog
      ref={dialog}
      className={`template-gallery template-${draft.kind}`}
      onCancel={onClose}
      aria-labelledby="gallery-title"
    >
      <header>
        <div>
          <p className="office-kicker">TU PUNTO DE PARTIDA</p>
          <h2 id="gallery-title">
            Plantillas para {draft.kind === "wedding" ? "tu boda" : "tu evento"}
          </h2>
          <p>
            Conservamos tus textos, imágenes y secciones al aplicar un estilo.
          </p>
        </div>
        <button type="button" onClick={onClose} aria-label="Cerrar galería">
          ×
        </button>
      </header>
      {(["sections", "flyer"] as const).map((mode) => (
        <section key={mode}>
          <h3>
            {mode === "sections" ? "Por secciones" : "Flyer · lienzos libres"}
          </h3>
          <div className="template-grid">
            {catalog
              .filter(
                (template) =>
                  template.kind === draft.kind && template.mode === mode,
              )
              .map((template) => (
                <button
                  type="button"
                  key={template.id}
                  className="template-card"
                  onClick={() => onApply(template)}
                >
                  <FlyerSurface
                    canvas={templateThumbnail(template)}
                    photoURL={() => ""}
                    label={template.name}
                  />
                  <strong>{template.name}</strong>
                  <span>{template.tagline}</span>
                  <b>Usar plantilla ↗</b>
                </button>
              ))}
          </div>
        </section>
      ))}
    </dialog>
  );
}
