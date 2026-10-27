import { useState } from "react";
import PreviewModal from "@/features/designer/preview-modal";
import Icon from "@/components/icon";
import type { Event } from "@/lib/events/types";
export default function DemoContinuation({ draft }: { draft: Event }) {
  const [preview, setPreview] = useState(false);
  return (
    <section className="event-form-card demo-continuation">
      <Icon name="check" />
      <h2>Tu diseño viene contigo</h2>
      <p>
        Conservaremos tus textos, fotos, colores y elementos de la demo.
        Completa los datos, paga y volverás directamente a este editor.
      </p>
      <button
        type="button"
        className="form-preview-button"
        onClick={() => setPreview(true)}
      >
        Ver mi diseño guardado
        <Icon name="eye" />
      </button>
      {preview && (
        <PreviewModal draft={draft} onClose={() => setPreview(false)} />
      )}
    </section>
  );
}
