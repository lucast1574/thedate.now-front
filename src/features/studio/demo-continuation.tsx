import { useTranslator } from "@/lib/i18n/react";
import { useState } from "react";
import PreviewModal from "@/features/designer/preview-modal";
import Icon from "@/components/icon";
import type { Event } from "@/lib/events/types";
export default function DemoContinuation({ draft }: { draft: Event }) {
  const i18n = useTranslator();

  const [preview, setPreview] = useState(false);
  return (
    <section className="event-form-card demo-continuation">
      <Icon name="check" />
      <h2>{i18n("Tu diseño viene contigo")}</h2>
      <p>
        {i18n(
          "Conservaremos tus textos, fotos, colores y elementos de la demo. Completa los datos, paga y volverás directamente a este editor.",
        )}
      </p>
      <button
        type="button"
        className="form-preview-button"
        onClick={() => setPreview(true)}
      >
        {i18n("Ver mi diseño guardado")} <Icon name="eye" />
      </button>
      {preview && (
        <PreviewModal draft={draft} onClose={() => setPreview(false)} />
      )}
    </section>
  );
}
