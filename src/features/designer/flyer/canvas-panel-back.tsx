import { useTranslator } from "@/lib/i18n/react";
import Icon from "@/components/icon";
export default function CanvasPanelBack({ onBack }: { onBack: () => void }) {
  const i18n = useTranslator();
  return (
    <button className="canvas-panel-back" onClick={onBack}>
      <Icon name="undo" /> {i18n("Volver a elementos")}
    </button>
  );
}
