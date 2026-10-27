import Icon from "./icon";
export default function TemplatePhotoPlaceholder() {
  return (
    <span
      className="template-photo-placeholder"
      role="img"
      aria-label="Pon tu foto aquí"
    >
      <Icon name="image" />
      <span>Pon tu foto aquí</span>
    </span>
  );
}
