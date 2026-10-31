import { useEffect, useRef } from "react";
import Icon from "@/components/icon";
import type { Event } from "@/lib/events/types";
import DesignPreview from "./design-preview";
export default function PreviewModal({
  onPublish,
  busy = false,
  feedback,
  draft,
  onClose,
}: {
  onPublish?: () => Promise<void>;
  busy?: boolean;
  feedback?: string;
  draft: Event;
  onClose: () => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    const currentDialog = dialog.current;
    document.body.style.overflow = "hidden";
    currentDialog?.showModal();
    return () => {
      currentDialog?.close();
      document.body.style.overflow = overflow;
      previous?.focus({ preventScroll: true });
    };
  }, []);
  return (
    <dialog
      ref={dialog}
      className="preview-modal"
      data-product={draft.kind}
      aria-labelledby="preview-title"
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
    >
      <header>
        <div className="preview-heading">
          <span className="preview-heading-mark">
            <Icon name={draft.kind === "wedding" ? "flower" : "sparkle"} />
          </span>
          <div>
            <span>
              {draft.kind === "wedding" ? "Save the Date" : "The Date"} · Vista
              previa
            </span>
            <h2 id="preview-title">{draft.title || "Tu invitación"}</h2>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar vista previa"
        >
          <Icon name="close" />
        </button>
      </header>
      <DesignPreview draft={draft} />
      {onPublish && (
        <footer className="design-publication-review">
          <p>
            Revisa el borrador. Al publicar, tus invitados verán esta versión en
            el mismo enlace.
          </p>
          {feedback && <p role="status">{feedback}</p>}
          <button
            type="button"
            className="editor-save"
            disabled={busy}
            onClick={onPublish}
          >
            {busy ? "Publicando…" : "Publicar cambios"}
          </button>
        </footer>
      )}
    </dialog>
  );
}
