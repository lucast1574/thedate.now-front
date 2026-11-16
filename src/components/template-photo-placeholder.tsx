import { useTranslator } from "@/lib/i18n/react";
import Icon from "./icon";
export default function TemplatePhotoPlaceholder() {
  const i18n = useTranslator();

  return (
    <span
      className="template-photo-placeholder"
      role="img"
      aria-label={i18n("Pon tu foto aquí")}
    >
      <Icon name="image" />
      <span>{i18n("Pon tu foto aquí")}</span>
    </span>
  );
}
