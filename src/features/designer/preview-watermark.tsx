import { useTranslator } from "@/lib/i18n/react";
import Icon from "@/components/icon";
export default function PreviewWatermark({ wedding }: { wedding: boolean }) {
  const i18n = useTranslator();

  return (
    <div
      className="preview-watermark"
      aria-hidden="true"
      data-product={wedding ? "wedding" : "general"}
    >
      <span>
        <Icon name="eye" /> {i18n("Vista previa")}{" "}
        <small>{wedding ? "Save the Date" : "The Date"}</small>
      </span>
    </div>
  );
}
