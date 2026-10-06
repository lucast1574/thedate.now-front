import { useEffect, useRef } from "react";
import type { Event } from "@/lib/events/types";
import DesignPreview from "./design-preview";
export default function PreviewModal({
  draft,
  onClose,
}: {
  draft: Event;
  onClose: () => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    dialog.current?.showModal();
  }, []);
  return (
    <dialog
      ref={dialog}
      className="preview-modal"
      aria-labelledby="preview-title"
      onCancel={onClose}
    >
      <header>
        <h2 id="preview-title">Vista previa de tu invitación</h2>
        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar vista previa"
        >
          ×
        </button>
      </header>
      <DesignPreview draft={draft} />
    </dialog>
  );
}
