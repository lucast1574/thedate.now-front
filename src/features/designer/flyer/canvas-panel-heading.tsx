import { useTranslator } from "@/lib/i18n/react";
export default function CanvasPanelHeading({
  tool,
  hidden,
}: {
  tool: string;
  hidden: boolean;
}) {
  const i18n = useTranslator();

  const title =
    {
      elements: i18n("Añadir elementos"),
      photos: i18n("Tus imágenes"),
      background: i18n("Fondo de tu invitación"),
      opening: i18n("Sobre de apertura"),
      pages: i18n("Secciones"),
      music: i18n("Ponle música"),
      layers: i18n("Capas del lienzo"),
      templates: i18n("Elige tu diseño"),
    }[tool] || i18n("Tu invitación");
  return (
    <header hidden={hidden}>
      <span>{i18n("TU INVITACIÓN")}</span>
      <h2>{title}</h2>
    </header>
  );
}
