import { useTranslator } from "@/lib/i18n/react";
import FlyerSurface from "@/components/flyer-surface";
import type { InvitationTemplate } from "@/lib/events/template-catalog";
import { templateCanvas } from "./template-canvas";
import { templateSequence } from "./template-sequence";
export default function TemplatePanelCard({
  template,
  onSelect,
}: {
  template: InvitationTemplate;
  onSelect: (id: string) => void;
}) {
  const i18n = useTranslator();
  return (
    <button
      type="button"
      className="template-panel-card"
      key={template.id}
      data-template-id={template.id}
      onClick={() => onSelect(template.id)}
      aria-label={i18n("Ver diseño {v0}", { v0: template.name })}
    >
      <div className="template-panel-art">
        <FlyerSurface
          canvas={templateCanvas(template, undefined, i18n)}
          photoURL={() => ""}
          label={template.name}
        />
      </div>
      <strong>{template.name}</strong>
      <span>
        {templateSequence(template, undefined, i18n).length}{" "}
        {i18n("secciones ·")} {i18n(template.category || "Otros")}
      </span>
    </button>
  );
}
